import { StyleSheet, Text } from "react-native";

export default function ItemLineTextValue(props) {
  return (
    <Text style={styles.text}>
      {props.text} : {props.tabs}
      <Text style={styles.innerText}>{props.value}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    padding: 5,
    paddingVertical: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    fontWeight: "bold",
  },
  innerText: {
    fontWeight: "normal",
  },
});
