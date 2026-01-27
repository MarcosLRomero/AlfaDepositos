import { localPaymentListStyles } from "@styles/PaymentStyle";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import PaymentFixedBottom from "@components/PaymentFixedBottom";
import PaymentItemLocal from "@components/PaymentItemLocal";

import Payment from "@db/Payment";

export default function PaymentsScreen({ navigation }) {
  const [isEmpty, setIsEmpty] = useState(false);
  const [payments, setPayments] = useState([]);

  const loadLocalPayments = async () => {
    setIsEmpty(false);

    const data = await Payment.findAll();
    setIsEmpty(data.length == 0);
    setPayments(data);
  };

  useEffect(() => {
    loadLocalPayments();
  }, [navigation]);

  return (
    <SafeAreaView style={[localPaymentListStyles.mainContainer]}>
      <View style={[localPaymentListStyles.container]}>
        <View>
          <TouchableOpacity style={[localPaymentListStyles.btnNewPayment]} onPress={() => navigation.navigate("NewPaymentScreen")}>
            <Text style={[localPaymentListStyles.textBtn]}>Nueva cobranza +</Text>
          </TouchableOpacity>
        </View>

        <View style={[localPaymentListStyles.titleContainer]}>
          <Text style={[localPaymentListStyles.title]}>Cobranzas pendientes de sincronización</Text>
          <Text style={[localPaymentListStyles.subtitle]}>Toque para compartir</Text>
          <Text style={[localPaymentListStyles.subtitle]}>Mantenga presionado para eliminar</Text>
        </View>

        {payments.length > 0 ? (
          <FlatList
            ListFooterComponent={<View></View>}
            ListFooterComponentStyle={{ height: 100 }}
            scrollEnabled={true}
            style={[localPaymentListStyles.flatList]}
            data={payments}
            keyExtractor={(item) => item.id + ""}
            renderItem={({ item }) => {
              return (
                <PaymentItemLocal
                  code={item.account}
                  total={item.amount || 0}
                  date={item.date}
                  name={item.name}
                  obs={item.obs}
                  id={item.id}
                  tc={item.tc}
                  internalId={item.paymentId}
                  callback={loadLocalPayments}
                ></PaymentItemLocal>
              );
            }}
          />
        ) : isEmpty ? (
          <Text style={[localPaymentListStyles.emptyText]}>No hay cobranzas cargadas</Text>
        ) : (
          <ActivityIndicator style={[localPaymentListStyles.loader]} size="large" color="#00ff00" />
        )}

        <PaymentFixedBottom nav={navigation}></PaymentFixedBottom>
      </View>
    </SafeAreaView>
  );
}
