import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import iconStorage from "@icons/warehouse.png";

export default function StorageStockInfo(props) {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View>
          <Image style={styles.image} source={iconStorage}></Image>
        </View>

        <View style={styles.highContainer}>
          <View style={styles.lowContainer}>
            <Text style={styles.text}>{props.name.trim() != "" ? props.name.replace("@", "") : "OTROS"}</Text>
            <Text style={(styles.stockText, styles.text)}>{props.stock}</Text>
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
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 2,
  },
  image: {
    width: 35,
    height: 35,
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
  text: {
    fontSize: 16,
  },
  stockText: {
    textAlign: "right",
  },
});
