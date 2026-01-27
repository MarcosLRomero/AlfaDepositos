import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

import imgPayment from "@icons/payment.png";
import { localItemPaymentStyles } from "@styles/PaymentStyle";

import Payment from "@db/Payment";
import PaymentInvoices from "@db/PaymentInvoices";
import PaymentMethods from "@db/PaymentMethods";
import PaymentMethod from "@db/PaymentMethod";
import Account from "@db/Account";
import Seller from "@db/Seller";

import usePrintAndShare from "@hooks/usePrintAndShare";
import useTemplateShare from "@hooks/useTemplateShare";

import { currencyFormat } from "@libraries/utils";

export default function PaymentItemLocal({ id, callback, name, tc, date, total, obs, internalId }) {

  const { generatePdf } = usePrintAndShare();
  const { getTemplate } = useTemplateShare();

  const handleTouch = () => {
    return Alert.alert("¿Eliminar?", "¿Está seguro que desea eliminar la cobranza? No se podrá recuperar.", [
      {
        text: "Si",
        onPress: () => {
          deletePayment();
        },
      },
      {
        text: "No",
      },
    ]);
  };

  const handleRePrint = async () => {

    const payload = await Payment.find(id)

    const account = await Account.findBy({ code_eq: payload.account });
    const seller = await Seller.findBy({ code_eq: payload.seller })

    payload.accountName = account ? account.name : "";
    payload.sellerName = seller?.name || "";


    const paymentInvoices = await PaymentInvoices.query({ where: { paymentId_eq: payload.paymentId } });
    paymentInvoices.map((item) => {
      item.checked = true
      item.fecha = item.date
      item.saldo = item.amount
    });

    const paymentMethods = await PaymentMethods.query({ where: { paymentId_eq: payload.paymentId } });

    for await (const item of paymentMethods) {
      const method = await PaymentMethod.findBy({ code_eq: item.account })
      item.name = method.name || ""
    }

    payload.invoices = paymentInvoices;
    payload.payments = paymentMethods;

    const html = await getTemplate("payment", payload);

    generatePdf(html);
  }

  const deletePayment = async () => {
    await Payment.destroy(parseInt(id));

    const paymentInvoices = await PaymentInvoices.query({ where: { paymentId_eq: internalId } });
    paymentInvoices.map(async (item) => {
      await PaymentInvoices.destroy(item.id);
    });

    const paymentMethods = await PaymentMethods.query({ where: { paymentId_eq: internalId } });
    paymentMethods.map(async (item) => {
      await PaymentMethods.destroy(item.id);
    });

    callback();
  };

  return (
    <TouchableOpacity onPress={handleRePrint} onLongPress={handleTouch}>
      <View style={[localItemPaymentStyles.container]}>
        <View>
          <Image style={[localItemPaymentStyles.image]} source={imgPayment}></Image>
        </View>

        <View style={[localItemPaymentStyles.highContainer]}>
          <View>
            <Text>{name}</Text>
          </View>
          <View style={[localItemPaymentStyles.lowContainer]}>
            <Text>
              {date} ({tc})
            </Text>
            {/* <Text style={[localItemPaymentStyles.price]}>{total.toFixed(2)}</Text> */}
            <Text style={[localItemPaymentStyles.price]}>{currencyFormat(total)}</Text>
          </View>
          <View>
            <Text>{obs}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
