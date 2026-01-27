import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { currencyFormat } from "@libraries/utils"

import CartItem from "./CartItem";

export default function CartList(props) {
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState(0);

  useEffect(() => {
    setItems(props.data.length);

    let suma = 0;
    for (let item of props.data) {
      if (item.disc > 0) {
        suma +=
          (parseFloat(item.price) - (parseFloat(item.disc) * parseFloat(item.price)) / 100) *
          parseFloat(item.qty);
      } else {
        suma += parseFloat(item.price) * parseFloat(item.qty);
      }
    }
    setTotal(currencyFormat(suma));
  });

  const handleDeleteProduct = (id) => {
    // console.log(id)
    let data = props.data.filter(function (item) {
      return item.code + "" + item.name + "" + item.price + "" + item.bultos + "" + item.qty !== id;
    });

    props.fnSetData(data);
  };

  const handleTouch = (id) => {
    return Alert.alert("¿Eliminar?", "¿Está seguro que desea eliminar el producto del pedido?", [
      {
        text: "Si",
        onPress: () => {
          handleDeleteProduct(id);
        },
      },
      {
        text: "No",
      },
    ]);
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.footer}>
          <Text style={styles.textFooter}>Items : {items}</Text>
          {props.showAmounts == 1 && <Text style={styles.textFooter}>Total {total}</Text>}
        </View>
      }
      ListFooterComponent={
        <View>
          <View style={styles.footer}>
            <Text style={styles.textFooter}>Items : {items}</Text>
            {props.showAmounts == 1 && <Text style={styles.textFooter}>Total {total}</Text>}
          </View>
          <Text style={styles.textDelProducto}>Toque un producto para eliminarlo</Text>
        </View>
      }
      style={styles.container}
      ListFooterComponentStyle={{ height: 400 }}
      data={props.data}
      keyExtractor={(item) => item.code + "" + item.name + "" + item.price + "" + item.bultos + "" + item.qty}
      renderItem={({ item }) => {

        return (
          <CartItem
            id={item.code + "" + item.name + "" + item.price + "" + item.bultos + "" + item.qty}
            name={item.name}
            code={item.code}
            price={item.disc > 0 ? item.price - (item.disc * item.price) / 100 : item.price}
            bultos={item.bultos}
            qty={item.qty}
            disc={item.disc}
            fnDelProduct={handleTouch}
            showAmount={props.showAmounts}
          ></CartItem>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "#000",
  },
  textFooter: {
    color: "#FFF",
  },
  textDelProducto: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
  },
});
