import { Picker } from "@react-native-picker/picker";
import { newPaymentStyles } from "@styles/PaymentStyle";
import { useContext, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import CDateTimePicker from "@components/DateTimePicker";
import InputDate from "@components/InputDate";
import SelectItem from "@components/SelectItem";

import { formatDate } from "@libraries/utils";

import Account from "@db/Account";
import Payment from "@db/Payment";
import PaymentInvoices from "@db/PaymentInvoices";
import PaymentMethod from "@db/PaymentMethod";
import PaymentMethods from "@db/PaymentMethods";

import { UserContext } from "@context/UserContext";

import { AntDesign, Entypo } from "@expo/vector-icons";
import { Collapse, CollapseBody, CollapseHeader } from "accordion-collapse-react-native";
import usePrintAndShare from "@hooks/usePrintAndShare";
import useTemplateShare from "@hooks/useTemplateShare";

import { getDataFromAPI } from "@libraries/api";
import Checkbox from "expo-checkbox";

const CURRENT_PAYMENT_INITIAL_STATE = { account: "", checkNumber: "", obs: "", amount: "" };

const PAYMENT_DATA = [
  {
    code: "CB",
    name: "Cobranza",
  },
  { code: "CBFP", name: "Cobranza Proforma" },
];

export default function NewPaymentScreen({ navigation }) {
  const [login, loginAction] = useContext(UserContext);

  const [accounts, setAccounts] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessagePM, setErrorMessagePM] = useState("");
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState(formatDate(new Date(), "DD/MM/YYYY"));
  const [show, setShow] = useState(false);

  const [paymenthMethods, setPaymenthMethods] = useState([]);

  const [selectTC, setSelectTC] = useState("CB");
  const [selectAccount, setSelectAccount] = useState("");

  const [currentPayment, setCurrentPayment] = useState(CURRENT_PAYMENT_INITIAL_STATE);

  const [invoices, setInvoices] = useState([]);

  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  const [currentAmounts, setCurrentAmounts] = useState({ pending: 0, payments: 0 });

  const [restart, setRestart] = useState(false);

  const [listOfPayments, setListOfPayments] = useState([]);

  const { generatePdf } = usePrintAndShare();
  const { getTemplate } = useTemplateShare();

  const searchAccount = async (name) => {
    const data = await Account.getAll(login.user.user, name == "" ? null : name, 10);
    setAccounts(data);
  };

  const searchPaymentMethods = async (text) => {
    if (text == "") {
      const data = await PaymentMethod.query({ page: 1, limit: 5 });
      setPaymenthMethods(data);
    } else {
      const data = await PaymentMethod.findLikeName(text);
      setPaymenthMethods(data);
    }
  };

  const handleChangeDate = (event, selectedDate) => {
    let currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(formatDate(currentDate));
    setDateString(formatDate(currentDate, true));
  };

  const handleSave = async (isSharing = false) => {
    setErrorMessage("");
    if (dateString == "") {
      setErrorMessage("Debe informar la fecha");
      return;
    }
    if (selectTC == "") {
      setErrorMessage("Debe informar el tipo de comprobante");
      return;
    }
    if (selectAccount == "") {
      setErrorMessage("Debe informar el cliente");
      return;
    }

    if (listOfPayments.length == 0) {
      setErrorMessage("Debe informar al menos un pago");
      return;
    }

    setSaving(true);

    const currentTime = new Date();

    const paymentId = `${login.user.user}${currentTime.getDate()}${currentTime.getMonth() + 1
      }${currentTime.getHours()}${currentTime.getMinutes()}${currentTime.getSeconds()}`;

    const payload = {
      date: dateString,
      account: selectAccount,
      payments: listOfPayments,
      seller: login.user.user,
      tc: selectTC,
      paymentId: paymentId,
      amount: parseFloat(currentAmounts.payments),
    };

    const cb = new Payment(payload);

    if (cb.save()) {
      //Grabo los medios de pago
      listOfPayments.map(async (payment) => {
        const payloadM = {
          paymentId: paymentId,
          account: payment.account,
          obs: payment.obs,
          checkNumber: payment.checkNumber,
          amount: payment.amount,
        };

        const cbm = new PaymentMethods(payloadM);
        await cbm.save();
      });

      //Grabo las facturas a aplicar
      invoices.map(async (invoice) => {
        if (invoice.checked) {
          const payloadC = {
            paymentId: paymentId,
            tc: invoice.tc,
            idcomprobante: invoice.idcomprobante,
            amount: invoice.saldo,
            date: invoice.fecha
          };

          const cbi = new PaymentInvoices(payloadC);
          await cbi.save();
        }
      });

      if (isSharing) {

        const account = await Account.findBy({ code_eq: payload.account });
        payload.accountName = account ? account.name : "";
        payload.sellerName = login.user.name;
        payload.invoices = invoices;
        payload.payments = listOfPayments;

        const html = await getTemplate("payment", payload);

        generatePdf(html);
      }

      navigation.navigate("PaymentsScreen", { reload: true });
    } else {
      setErrorMessage("Error al generar la cobranza");
    }
  };

  const deletePaymentFromList = (account) => {
    const newPaymemnts = listOfPayments.filter((item) => {
      return item.account != account;
    });

    const currentPayments = newPaymemnts.reduce((prev, next) => parseFloat(prev) + parseFloat(next.amount), 0);
    setCurrentAmounts({ ...currentAmounts, payments: currentPayments });

    setListOfPayments(newPaymemnts);
  };

  const getListOfPayments = () => {
    return listOfPayments.map((item) => {
      return (
        <View key={item.account + item.amount} style={[newPaymentStyles.itemListOfPayments]}>
          <Text>
            {item.account} - {item.name}
          </Text>
          <Text>$ {item.amount}</Text>
          <Text>
            <TouchableOpacity style={[newPaymentStyles.btnDeleteCurrentPayment]} onPress={() => deletePaymentFromList(item.account)}>
              <Text style={[newPaymentStyles.textBtnDeleteCurrentPayment]}>X</Text>
            </TouchableOpacity>
          </Text>
        </View>
      );
    });
  };

  const addPaymentToList = async () => {
    const currentMethod = currentPayment.account;
    let sumAmount = 0;
    setPaymenthMethods([]);

    if (
      currentMethod === "" ||
      currentMethod === null ||
      currentMethod === undefined ||
      currentPayment.amount === "" ||
      currentPayment.amount === null ||
      currentPayment.amount === undefined
    ) {
      setErrorMessagePM("Debe seleccionar un medio de pago y un importe");
      return;
    }

    setErrorMessagePM("");

    const existing = listOfPayments.filter((item) => item.account == currentMethod);
    let payload = {};
    let namePayment = "";

    const currentPayments = listOfPayments.reduce((prev, next) => parseFloat(prev) + parseFloat(next.amount), 0);
    sumAmount = parseFloat(currentPayment.amount);

    if (existing.length > 0) {
      existing[0].amount = parseFloat(existing[0].amount) + parseFloat(currentPayment.amount);
      payload = existing[0];

      deletePaymentFromList(currentMethod);
    } else {
      const data = await PaymentMethod.query({ where: { code_eq: currentMethod } });
      if (data) {
        namePayment = data[0].name;
      }
      payload = {
        name: namePayment,
        ...currentPayment,
      };
    }

    setCurrentAmounts({ ...currentAmounts, payments: currentPayments + sumAmount });

    setListOfPayments((current) => [...current, payload]);
    setRestart(true);
    setCurrentPayment(CURRENT_PAYMENT_INITIAL_STATE);
  };

  const loadInvoices = async () => {
    setErrorMessage("");

    if (selectAccount === "") {
      setErrorMessage("Debe seleccionar un cliente");
      return;
    }

    setIsLoadingInvoices(true);

    const data = await getDataFromAPI(`sales/pending_invoices/${selectAccount}`);
    if (data.status_code === 200) {
      if (data.data.length > 0) {
        const newInvoices = [];
        data.data.map((invoice) => {
          invoice.checked = false;
          newInvoices.push(invoice);
        });

        setInvoices(newInvoices);
      } else {
        // setEmpty(true);
        // setErrorMessage("No hay información disponible");
      }
    } else {
      // setEmpty(true);
      setErrorMessage(data.message);
    }

    setIsLoadingInvoices(false);
  };

  const checkInvoice = (tc, idcomprobante) => {
    let sumAmount = 0;
    let isChecked = false;

    const currentInvoices = invoices.filter((invoice) => {
      return invoice.tc + invoice.idcomprobante != tc + idcomprobante && invoice.checked;
    });

    setInvoices((current) =>
      current.map((obj) => {
        if (obj.tc + obj.idcomprobante === tc + idcomprobante) {
          sumAmount = parseFloat(obj.saldo);
          isChecked = !obj.checked;
          return { ...obj, checked: !obj.checked };
        }

        return obj;
      })
    );

    if (isChecked) {
      sumAmount = sumAmount + currentInvoices.reduce((prev, next) => parseFloat(prev) + parseFloat(next.saldo), 0);
    } else {
      sumAmount = currentInvoices.reduce((prev, next) => parseFloat(prev) + parseFloat(next.saldo), 0);
    }

    setCurrentAmounts({ ...currentAmounts, pending: sumAmount });
  };

  const getInvoicesPending = () => {
    if (invoices.length == 0) {
      return <Text style={[newPaymentStyles.textError]}>No tiene comprobantes pendientes</Text>;
    }

    return invoices.map((invoice) => {
      return (
        <View key={invoice.tc + invoice.idcomprobante} style={[newPaymentStyles.containerItemListOfInvoices]}>
          <Checkbox
            value={invoice.checked}
            onValueChange={() => checkInvoice(invoice.tc, invoice.idcomprobante)}
            color={invoice.checked ? "#4630EB" : undefined}
          />
          <View style={{ flexDirection: "column" }}>
            <View style={[newPaymentStyles.itemListOfInvoices]}>
              <Text>
                {invoice.tc} - {invoice.idcomprobante}
              </Text>

              <Text>$ {invoice.saldo}</Text>
            </View>
            <View style={[newPaymentStyles.itemListOfInvoices]}>
              <Text>
                {invoice.fecha} - {invoice.detalle}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView>
      <View style={[newPaymentStyles.container]}>
        <View style={[newPaymentStyles.header]}>
          <View style={[newPaymentStyles.headerBox, { backgroundColor: "#F19039" }]}>
            <Text style={[newPaymentStyles.headerTitle]}>A PAGAR</Text>
            <Text style={[newPaymentStyles.headerSubtitle]}>$ {currentAmounts.pending.toFixed(2)}</Text>
          </View>
          <View style={[newPaymentStyles.headerBox, { backgroundColor: "green" }]}>
            <Text style={[newPaymentStyles.headerTitle]}>PAGANDO</Text>
            <Text style={[newPaymentStyles.headerSubtitle]}>$ {currentAmounts.payments.toFixed(2)}</Text>
          </View>
        </View>
        <ScrollView style={[newPaymentStyles.containerScroll]}>
          <View style={[newPaymentStyles.containerDates]}>
            <InputDate fullWidth={true} title="Fecha" value={dateString} editable={false} />
          </View>

          <Text style={[newPaymentStyles.textPicker]}>Comprobante</Text>
          <View style={[newPaymentStyles.containerPicker]}>
            <Picker selectedValue={selectTC} style={[newPaymentStyles.picker]} onValueChange={(itemValue) => setSelectTC(itemValue)}>
              {PAYMENT_DATA.map((item) => {
                return <Picker.Item key={item.code} label={item.name} value={item.code}></Picker.Item>;
              })}
            </Picker>
          </View>

          <SelectItem
            style={[newPaymentStyles.element]}
            title="Cliente"
            data={accounts}
            saveState={setSelectAccount}
            valueState={selectAccount}
            resetDataFn={setAccounts}
            fieldCode="code"
            fieldName="name"
            key={3}
            changeTextFn={searchAccount}
            extraFnOnChange={() => {
              setInvoices([]);
              setCurrentAmounts({ ...currentAmounts, pending: 0 });
            }}
          ></SelectItem>

          <Text style={[newPaymentStyles.titleCurrentMethods]}>Medios de pago cargados</Text>
          {getListOfPayments()}

          <Collapse style={{ marginVertical: 10 }}>
            <CollapseHeader>
              <View>
                <Text style={[newPaymentStyles.accordionHeader]}>Ingresar medios de pago</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={[newPaymentStyles.addPaymentContainer]}>
                <SelectItem
                  style={[newPaymentStyles.element]}
                  title="Medio de Pago"
                  data={paymenthMethods}
                  saveState={(text) => {
                    setCurrentPayment({ ...currentPayment, account: text });
                  }}
                  valueState={currentPayment.account}
                  resetDataFn={setPaymenthMethods}
                  fieldCode="code"
                  fieldName="name"
                  key={2}
                  reset={restart}
                  changeTextFn={(text) => {
                    setRestart(false);
                    searchPaymentMethods(text);
                  }}
                ></SelectItem>

                <View style={[newPaymentStyles.element]}>
                  <Text>Importe</Text>
                  <TextInput
                    value={currentPayment.amount}
                    onChangeText={(value) => setCurrentPayment({ ...currentPayment, amount: value })}
                    keyboardType="number-pad"
                    style={[newPaymentStyles.textInput]}
                  ></TextInput>
                </View>

                <View style={[newPaymentStyles.element]}>
                  <Text>Nro Cheque/Transferencia</Text>
                  <TextInput
                    value={currentPayment.checkNumber}
                    onChangeText={(text) => setCurrentPayment({ ...currentPayment, checkNumber: text })}
                    style={[newPaymentStyles.textInput]}
                  ></TextInput>
                </View>

                {/* <View style={[newPaymentStyles.element]}>
                  <Text>Observaciones</Text>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    value={currentPayment.obs}
                    onChangeText={(text) => setCurrentPayment({ ...currentPayment, obs: text })}
                    style={[newPaymentStyles.textInput]}
                  ></TextInput>
                </View> */}

                {/* <Button title="Agregar medio de pago" onPress={addPaymentToList} /> */}

                <TouchableOpacity onPress={addPaymentToList} style={[newPaymentStyles.btnNormal]}>
                  <Text style={[newPaymentStyles.textBtnNormal]}>Agregar medio de pago</Text>
                </TouchableOpacity>

                <View>{errorMessagePM != "" && <Text style={[newPaymentStyles.textError]}>{errorMessagePM}</Text>}</View>
              </View>
            </CollapseBody>
          </Collapse>
          <Collapse style={{ marginVertical: 10 }}>
            <CollapseHeader>
              <View>
                <Text style={[newPaymentStyles.accordionHeader]}>Sel. comprobantes a aplicar</Text>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={[newPaymentStyles.addPaymentContainer]}>
                <TouchableOpacity onPress={loadInvoices} style={[newPaymentStyles.btnloadInvoices]}>
                  <Text style={[newPaymentStyles.textBtnloadInvoices]}>Cargar comprobantes pendientes</Text>
                </TouchableOpacity>

                {isLoadingInvoices ? (
                  <ActivityIndicator style={[newPaymentStyles.loader]} size="small" color="#00ff00" />
                ) : (
                  <View>{getInvoicesPending()}</View>
                )}
              </View>
            </CollapseBody>
          </Collapse>

          <View>{errorMessage != "" && <Text style={[newPaymentStyles.textError]}>{errorMessage}</Text>}</View>
          {saving && <ActivityIndicator style={[newPaymentStyles.loader]} size="large" color="#00ff00" />}

          <View style={[newPaymentStyles.containerButtons]}>
            <TouchableOpacity style={[newPaymentStyles.btnSave]} onPress={() => handleSave(false)}>
              <Entypo name="save" color="white" size={18} />
              <Text style={[newPaymentStyles.textBtnSave]}>Grabar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[newPaymentStyles.btnSaveWithEmail]} onPress={() => handleSave(true)}>
              <AntDesign name="sharealt" color="white" size={18} />
              <Text style={[newPaymentStyles.textBtnSave]}>Grabar y compartir</Text>
            </TouchableOpacity>
          </View>

          <View>{show && <CDateTimePicker date={date} changeFunction={handleChangeDate} />}</View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
