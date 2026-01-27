import { StyleSheet, Text, View } from "react-native";

export default function OrderProduct({ id, code, name, qty, amount, total }) {
  return (
    <View style={styles.container} key={id + ""}>
      <View style={styles.highContainer}>
        <Text>
          {code} - {name}
        </Text>
      </View>
      <View style={styles.lowContainer}>
        <Text>
          {qty} x $ {parseFloat(amount).toFixed(2)}
        </Text>
        <Text style={styles.price}>$ {parseFloat(total).toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
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
  lowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    alignItems: "center",
  },
  price: {
    textAlign: "right",
  },
});
