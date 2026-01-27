import { Image, StyleSheet, Text, View } from "react-native";

import imgPayment from "@icons/payment.png";

export default function PaymentItem({ total, date, name, tc }) {
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.image} source={imgPayment}></Image>
      </View>

      <View style={styles.highContainer}>
        <View>
          <Text>{name}</Text>
        </View>
        <View style={styles.lowContainer}>
          <Text>
            {date} ({tc})
          </Text>
          <Text style={styles.price}>$ {parseFloat(total).toFixed(2)}</Text>
        </View>
      </View>
    </View>
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
