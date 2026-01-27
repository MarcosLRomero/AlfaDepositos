import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { currencyFormat } from "@libraries/utils"

// import imgProduct from "@icons/product2.png";

export default function CartItem(props) {
  return (
    <TouchableOpacity onPress={() => props.fnDelProduct(props.id)}>
      <View style={styles.container}>
        <View>
          {/* <Image style={styles.image} source={imgProduct}></Image> */}
          <ProductImage fileName={props?.code} widthImage={40} heightImage={40} />

        </View>

        <View style={styles.highContainer}>
          <View>
            <Text>{props.name}</Text>
          </View>
          {props.showAmount == 1 ? (
            <View style={styles.lowContainer}>
              <Text>
                {props.qty +
                  " x " + currencyFormat(props.price) +
                  (props.disc > 0 ? ` (- ${props.disc}%)` : "")} {parseInt(props.bultos) > 0 && ` (x ${props.bultos} blts.)`}
              </Text>

              <Text style={styles.price}>{currencyFormat((parseFloat(props.qty) * parseFloat(props.price)))}</Text>
            </View>
          ) : (
            <Text>x {props.qty} {parseInt(props.bultos) > 0 && ` (x ${props.bultos} blts.)`}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  highContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "85%",
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
