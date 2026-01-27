import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import StorageStockInfo from "@components/StorageStockInfo";
import iconStock from "@icons/stock.png";
import { getDataFromAPI } from "@libraries/api";
import { stockScreenStyles } from "@styles/ProductStyle";
import { getProductStock } from "../../services/product";

export default function ProductStockScreen({ navigation, route }) {

  const { code = null, name = null } = route?.params || {}


  const [isEmpty, setIsEmpty] = useState(false);
  const [storageInfo, setStorageInfo] = useState([]);
  const [statusResponse, setStatusResponse] = useState("");



  async function loadStockOnline() {

    // const data = await getDataFromAPI("stock/product", JSON.stringify(payload), "POST");

    const data = await getProductStock(code);

    if (data.status_code === 200) {
      if (data.data.length > 0) {
        setStorageInfo(data.data);
      } else {
        setStatusResponse("No hay información disponible");
      }
      setIsEmpty(data.data.length == 0);
    } else {
      setIsEmpty(true);
      setStatusResponse(data.message);
    }
  }

  useEffect(() => {
    loadStockOnline();
  }, []);

  return (
    <SafeAreaView>
      <View style={[stockScreenStyles.container]}>
        <View>
          <Image style={[stockScreenStyles.image]} source={iconStock} />
        </View>
        <View style={[stockScreenStyles.containerTitle]}>
          <Text style={[stockScreenStyles.title]}>Ficha de stock # {code}</Text>
          <Text style={[stockScreenStyles.titleName]}>{name?.trim()}</Text>
        </View>

        {storageInfo.length > 0 ? (
          <FlatList
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ height: 200 }}
            scrollEnabled={true}
            style={[stockScreenStyles.flatList]}
            data={storageInfo}
            keyExtractor={(item) => item.deposito + ""}
            renderItem={({ item }) => {
              return <StorageStockInfo stock={item.stock} name={item.deposito}></StorageStockInfo>;
            }}
          />
        ) : isEmpty ? (
          <Text style={[stockScreenStyles.labelError]}>{statusResponse}</Text>
        ) : (
          <ActivityIndicator style={[stockScreenStyles.loader]} size="large" color="#00ff00" />
        )}
      </View>
    </SafeAreaView>
  );
}
