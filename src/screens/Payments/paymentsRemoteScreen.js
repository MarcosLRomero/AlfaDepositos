import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Text, TouchableOpacity, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { remotePaymentStyles } from "@styles/PaymentStyle";

import CDateTimePicker from "@components/DateTimePicker";
import InputDate from "@components/InputDate";
import PaymentFixedBottom from "@components/PaymentFixedBottom";
import PaymentItem from "@components/PaymentItem";

import { formatDate } from "@libraries/utils";

import { UserContext } from "@context/UserContext";
import { getDataFromAPI } from "../../libraries/api";
import { currencyFormat } from "../../libraries/utils";

export default function PaymentsRemoteScreen({ navigation }) {
  const [login, loginAction] = useContext(UserContext);

  const [isEmpty, setIsEmpty] = useState(false);

  const [date, setDate] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [dateString, setDateString] = useState("");
  const [dateStringTo, setDateStringTo] = useState("");

  const [show, setShow] = useState(false);
  const [showDateTo, setShowDateTo] = useState(false);
  const [payments, setPayments] = useState([]);
  const [statusResponse, setStatusResponse] = useState("");

  const handleChangeDate = (event, selectedDate) => {
    let currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");

    setDate(formatDate(currentDate));
    setDateString(formatDate(currentDate, true));
  };

  const handleChangeDateTo = (event, selectedDate) => {
    let currentDate = selectedDate || date;
    setShowDateTo(Platform.OS === "ios");
    setDateTo(formatDate(currentDate));
    setDateStringTo(formatDate(currentDate, true));
  };

  const showDatepicker = () => {
    setShow(true);
    Keyboard.dismiss();
  };

  const showDatepickerDateTo = () => {
    setShowDateTo(true);
    Keyboard.dismiss();
  };

  const handleSearchPayments = async () => {
    setIsEmpty(false);
    const newDate = new Date();
    let dateFrom, dateUntil;

    dateFrom = date != "" ? formatDate(date, true, true) : formatDate(newDate, true, true);
    dateUntil = dateTo != "" ? formatDate(dateTo, true, true) : formatDate(newDate, true, true);

    const payload = {
      seller: login.user.user,
      dateFrom,
      dateUntil,
    };

    const data = await getDataFromAPI("payment/search", JSON.stringify(payload), "POST");

    if (data.status_code === 200) {
      if (data.data.length > 0) {
        setPayments(data.data);
      } else {
        setStatusResponse("No se encontraron cobranzas.");
      }
      setIsEmpty(data.data.length == 0);
    } else {
      setIsEmpty(true);
      setStatusResponse(data.message);
    }
  };

  useEffect(() => {
    setIsEmpty(true);
  }, []);

  return (
    <SafeAreaView style={[remotePaymentStyles.mainContainer]}>
      <View style={[remotePaymentStyles.container]}>
        <Text style={[remotePaymentStyles.title]}>
          Desde aquí podrá consultar las cobranzas remotas cargadas en el servidor.
        </Text>

        <View style={[remotePaymentStyles.containerDates]}>
          <InputDate title="Desde" value={dateString} callback={showDatepicker}></InputDate>
          <InputDate title="Hasta" value={dateStringTo} callback={showDatepickerDateTo}></InputDate>
        </View>

        <View>
          <TouchableOpacity style={[remotePaymentStyles.btnSearchPayment]} onPress={handleSearchPayments}>
            <Text style={[remotePaymentStyles.textBtn]}>Consulta remota</Text>
          </TouchableOpacity>
        </View>

        <View>
          {show ? (
            <CDateTimePicker date={date} changeFunction={handleChangeDate} />
          ) : showDateTo ? (
            <CDateTimePicker date={dateTo} changeFunction={handleChangeDateTo} />
          ) : (
            <View></View>
          )}
        </View>

        {payments.length > 0 ? (
          <View>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
              backgroundColor: 'cyan',
              paddingVertical: 4
            }}>TOTAL COBRADO {currencyFormat(payments?.reduce((p, c) => p + parseFloat(c.importe), 0))}</Text>
            <FlatList
              ListFooterComponent={<View></View>}
              ListFooterComponentStyle={{ height: 100 }}
              scrollEnabled={true}
              style={[remotePaymentStyles.flatList]}
              data={payments}
              keyExtractor={(item) => item.idcomprobante + item.importe + ""}
              renderItem={({ item }) => {
                return (
                  <PaymentItem
                    total={item.importe}
                    date={item.fecha}
                    name={item.nombre}
                    tc={item.tc}
                  ></PaymentItem>
                );
              }}
            />
          </View>
        ) : isEmpty ? (
          <Text style={[remotePaymentStyles.emptyText]}>{statusResponse}</Text>
        ) : (
          <ActivityIndicator style={[remotePaymentStyles.loader]} size="large" color="#00ff00" />
        )}
        <PaymentFixedBottom nav={navigation}></PaymentFixedBottom>
      </View>
    </SafeAreaView >
  );
}
