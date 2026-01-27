import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import iconOrder from "@icons/orders2.png";
import { remoteDetailOrderStyles } from "@styles/OrderStyle";

import OrderProduct from "@components/OrderProduct";
import { getDataFromAPI } from "@libraries/api";

export default function OrderDetailScreen({ navigation, route }) {
  const [detail, setDetail] = useState([]);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState("");

  const { tc = null, invoice = null, name = null } = route?.params || {}


  const loadDocument = async () => {
    const data = await getDataFromAPI(
      `order/detail/${tc}/${invoice}`
    );

    if (!data.error) {
      if (data.data.length > 0) {
        setTotal(data.data[0].total_comprobante);
        setDate(data.data[0].fecha);
        setDetail(data.data);
      }
    }
  };

  useEffect(() => {
    loadDocument();
  }, []);

  return (
    <SafeAreaView style={[remoteDetailOrderStyles.mainContainer]}>
      <View style={[remoteDetailOrderStyles.container]}>
        {detail.length > 0 ? (
          <View>
            <View style={[remoteDetailOrderStyles.headContainer]}>
              <Image source={iconOrder} />
              <Text style={[remoteDetailOrderStyles.nameAccount]}>{name}</Text>
              <Text style={[remoteDetailOrderStyles.title]}>
                {tc} {invoice}
              </Text>
              <Text>{date}</Text>
            </View>

            <FlatList
              ListFooterComponent={<View />}
              ListFooterComponentStyle={{ height: 500 }}
              data={detail}
              keyExtractor={(item) => item.idarticulo + item.cantidad + item.total + ""}
              renderItem={({ item }) => {

                return (
                  <OrderProduct
                    code={item.idarticulo}
                    name={item.descripcion}
                    qty={item.cantidad}
                    amount={item.importe}
                    id={item.idarticulo + item.cantidad + item.total}
                    total={parseFloat(item.importe) * parseFloat(item.cantidad)}
                  />
                );
              }}
            />

            <View style={[remoteDetailOrderStyles.containerTotal]}>
              <Text style={[remoteDetailOrderStyles.textTotal]}>Total</Text>
              <Text style={[remoteDetailOrderStyles.textTotal]}>$ {parseFloat(total).toFixed(2)}</Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator style={[remoteDetailOrderStyles.loader]} size="large" color="#00ff00" />
        )}
      </View>
    </SafeAreaView>
  );
}
