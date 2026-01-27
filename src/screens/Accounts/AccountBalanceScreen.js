import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View, TouchableOpacity } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import iconBalance from "@icons/balance.png";
import { balanceStyles } from "@styles/AccountStyle";

import AccountBalanceItem from "@components/AccountBalanceItem";
import { getDataFromAPI } from "@libraries/api";

import usePrintAndShare from "@hooks/usePrintAndShare";
import useTemplateShare from "@hooks/useTemplateShare";
import { AntDesign } from "@expo/vector-icons";

export default function AccountBalanceScreen({ navigation, route }) {

  const { code = null, name = null } = route?.params || {}


  const [empty, setEmpty] = useState(false);
  const [balance, setBalance] = useState([]);
  const [statusResponse, setStatusResponse] = useState("");

  const { generatePdf } = usePrintAndShare();
  const { getTemplate } = useTemplateShare();

  async function loadAccountBalance() {
    const data = await getDataFromAPI(
      `account/get_balance/${code}/20100101/22000101/0`
    );
    if (data.status_code === 200) {
      if (data.data.length > 0) {
        setBalance(data.data);
      } else {
        setEmpty(true);
        setStatusResponse("No hay información disponible");
      }
    } else {
      setEmpty(true);
      setStatusResponse(data.message);
    }
  }

  useEffect(() => {
    loadAccountBalance();
  }, []);

  const handleShare = async () => {
    const html = await getTemplate("balance", {
      balance,
      account: `${code} - ${name} `,
    });
    generatePdf(html);
  };

  return (
    <SafeAreaView>
      <View style={[balanceStyles.container]}>
        <View>
          <Image style={[balanceStyles.image]} source={iconBalance} />
        </View>
        <View style={[balanceStyles.containerTitle]}>
          <Text style={[balanceStyles.title]}>{code}</Text>
          <Text style={[balanceStyles.titleName]}>{name}</Text>
        </View>

        <TouchableOpacity style={[balanceStyles.btnShare]} onPress={handleShare}>
          <AntDesign name="sharealt" color="white" size={18} />
          <Text style={[balanceStyles.textBtn]}>Compartir</Text>
        </TouchableOpacity>

        {balance.length > 0 ? (
          <FlatList
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ height: 100 }}
            scrollEnabled={true}
            style={[balanceStyles.flatList]}
            data={balance}
            keyExtractor={(item) => item.idcomprobante + item.orden + ""}
            renderItem={({ item }) => {
              return (
                <AccountBalanceItem
                  detail={item.detalle}
                  date={item.fecha}
                  amount={item.importe}
                  tc={item.tc}
                  invoice={item.idcomprobante}
                />
              );
            }}
          />
        ) : empty ? (
          <Text>{statusResponse}</Text>
        ) : (
          <ActivityIndicator style={[balanceStyles.loader]} size="large" color="#00ff00" />
        )}
      </View>
    </SafeAreaView>
  );
}
