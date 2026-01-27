import imgLocalPayment from "@icons/payment32.png";
import imgRemotePayment from "@icons/payment32_1.png";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const PaymentFixedBottom = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => props.nav.navigate("PaymentsScreen")}
        style={[styles.btn, styles.firstBtn]}
      >
        <Image style={styles.img} source={imgLocalPayment}></Image>
        <Text style={styles.textBtn}>Local</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.nav.navigate("PaymentsRemoteScreen")} style={styles.btn}>
        <Image style={styles.img} source={imgRemotePayment}></Image>

        <Text style={styles.textBtn}>Consulta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    height: 70,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  btn: {
    height: "100%",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  textBtn: {
    fontSize: 16,
    marginLeft: 10,
  },
  firstBtn: {
    borderRightWidth: 1,
    borderRightColor: "#e1e1e1",
    marginLeft: -5,
  },
});

export default PaymentFixedBottom;
