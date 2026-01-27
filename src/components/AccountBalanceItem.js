import { StyleSheet, Text, View } from "react-native";

export default function AccountBalanceItem({ detail, date, amount, tc, invoice }) {
  return (
    <View style={styles.container}>
      <View style={styles.highContainer}>
        <Text style={styles.text}>{detail}</Text>
        <View style={styles.lowContainer}>
          <Text style={[invoice == "SALDO ANTERIOR" || invoice == "SALDO ACTUAL" ? styles.titleText : ""]}>
            {tc} {invoice}
          </Text>
          <Text style={[invoice == "SALDO ANTERIOR" || invoice == "SALDO ACTUAL" ? styles.titleText : ""]}>
            $ {parseFloat(amount).toFixed(2)}
          </Text>
        </View>
        <Text>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  highContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  lowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
  },
  amountText: {
    textAlign: "right",
  },
  titleText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 17,
  },
});
