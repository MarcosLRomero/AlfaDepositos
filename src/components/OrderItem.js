import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { currencyFormat } from "@libraries/utils"

import Order from "@db/Order";
import imgOrders from "@icons/orders2.png";
import imgArca from "@icons/arca.png";
import useTemplateShare from "../hooks/useTemplateShare";
import usePrintAndShare from "../hooks/usePrintAndShare";

export default function OrderItem(props) {
  const { tc, invoice, name, id, date, total, remote, navigation, item } = props;
  const { getTemplate } = useTemplateShare();
  const { generatePdf, printDocument } = usePrintAndShare();

  const handleClic = async (remote) => {
    if (remote) {
      navigation.navigate("OrderDetailScreen", {
        tc: tc,
        invoice: invoice,
        name: name,
      });
    } else {
      //Verifico si existe el pedido
      const order = await Order.findById(id);
      if (order.length > 0) {
        if (item?.ecpte == null) {
          navigation.navigate("EditOrderScreen", { navigation, id });
        } else {
          // const html = await getTemplate("efc", { order: item });
          // generatePdf(html);

        }
      } else {
        Alert.alert("Comprobante inexistente", "El comprobante fue eliminado, recarge la pantalla.");
        return;
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleClic(remote);
      }}
    >
      <View style={styles.container}>
        <View>
          <Image style={styles.image} source={(item?.ecpte == null) ? imgOrders : imgArca}></Image>
        </View>

        <View style={styles.highContainer}>
          <View>
            <Text>{name}</Text>
          </View>

          <View style={styles.lowContainer}>
            <Text>{date}</Text>
            <Text style={styles.price}> {currencyFormat(total || 0)}</Text>
          </View>

          <View>
            <Text>{item?.tc} {item?.ecpte}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 2,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  highContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "85%",
  },
  lowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    alignItems: "center",
  },
  price: {
    textAlign: "right",
  },
});
