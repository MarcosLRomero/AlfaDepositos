import { FlatList, StyleSheet } from "react-native";

import CartItem from "./CartItem";

export default function CartList(props) {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 5,
    },
  });

  return (
    <FlatList
      style={styles.container}
      data={props.data}
      keyExtractor={(item) => item.code1 + ""}
      renderItem={({ item, id }) => {
        return <CartItem name={item.name} code={item.code} price={item.price} qty={item.qty}></CartItem>;
      }}
    />
  );
}
