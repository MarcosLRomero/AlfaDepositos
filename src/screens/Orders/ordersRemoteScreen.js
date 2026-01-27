import { useContext, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Text, TouchableOpacity, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { remoteOrderStyles } from "@styles/OrderStyle";

import CDateTimePicker from "@components/DateTimePicker";
import InputDate from "@components/InputDate";
import OrderItem from "@components/OrderItem";

import { formatDate } from "@libraries/utils";

import { UserContext } from "@context/UserContext";
import { getDataFromAPI } from "../../libraries/api";

export default function OrdersRemoteScreen({ navigation }) {
  const [login, loginAction] = useContext(UserContext);

  const [isEmpty, setIsEmpty] = useState(true);

  const [date, setDate] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [dateString, setDateString] = useState("");
  const [dateStringTo, setDateStringTo] = useState("");

  const [statusResponse, setStatusResponse] = useState("");

  const [show, setShow] = useState(false);
  const [showDateTo, setShowDateTo] = useState(false);

  const [orders, setOrders] = useState([]);

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
    const newDate = new Date();

    setIsEmpty(false);
    let dateFrom, dateUntil;

    dateFrom = date != "" ? formatDate(date, true, true) : formatDate(newDate, true, true);
    dateUntil = dateTo != "" ? formatDate(dateTo, true, true) : formatDate(newDate, true, true);

    const payload = {
      seller: login.user.user,
      dateFrom,
      dateUntil,
    };

    const data = await getDataFromAPI("order/search", JSON.stringify(payload), "POST");
    if (data.status_code === 200) {
      if (data.data.length > 0) {
        setOrders(data.data);
      } else {
        setStatusResponse("No se encontraron pedidos.");
      }
      setIsEmpty(data.data.length == 0);
    } else {
      setIsEmpty(true);
      setStatusResponse(data.message);
    }
  };

  return (
    <SafeAreaView style={[remoteOrderStyles.mainContainer]}>
      <View style={[remoteOrderStyles.container]}>
        <Text style={[remoteOrderStyles.title]}>
          Desde aquí podrá consultar los pedidos remotos cargadas en el servidor
        </Text>

        <View style={[remoteOrderStyles.containerDates]}>
          <InputDate title="Desde" value={dateString} callback={showDatepicker}></InputDate>
          <InputDate title="Hasta" value={dateStringTo} callback={showDatepickerDateTo}></InputDate>
        </View>

        <View>
          <TouchableOpacity style={[remoteOrderStyles.btnSearchPayment]} onPress={handleSearchPayments}>
            <Text style={[remoteOrderStyles.textBtn]}>Consulta remota</Text>
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

        {orders.length > 0 ? (
          <FlatList
            ListFooterComponent={<View></View>}
            ListFooterComponentStyle={{ height: 50 }}
            scrollEnabled={true}
            style={[remoteOrderStyles.flatList]}
            data={orders}
            keyExtractor={(item) => item.idcomprobante + ""}
            renderItem={({ item }) => {
              return (
                <OrderItem
                  total={item.importe}
                  date={item.fecha}
                  name={item.nombre}
                  remote={true}
                  tc={item.tc}
                  invoice={item.idcomprobante}
                  navigation={navigation}
                />
              );
            }}
          />
        ) : isEmpty ? (
          <Text style={[remoteOrderStyles.emptyText]}>{statusResponse}</Text>
        ) : (
          <ActivityIndicator style={[remoteOrderStyles.loader]} size="large" color="#00ff00" />
        )}
      </View>
    </SafeAreaView>
  );
}
