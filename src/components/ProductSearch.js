import { Image, Text, TouchableOpacity, View } from "react-native";
import { currencyFormat } from "@libraries/utils"

import imgProduct from "@icons/product2.png";
import { cProductSearchStyles } from "@styles/ProductStyle";

export default function ProductSearch(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.handleRestart();
        props.functionCall(props.code, props.name, props.price);
      }}
    >
      <View style={[cProductSearchStyles.container]}>
        <Image style={[cProductSearchStyles.image]} source={imgProduct}></Image>

        <View style={[cProductSearchStyles.highContainer]}>
          <View>
            <Text>{props.name?.trim()}</Text>
          </View>
          {props.showAmount == 1 ? (
            <View style={[cProductSearchStyles.lowContainer]}>
              <Text># {props.code}</Text>
              <Text style={[cProductSearchStyles.price]}>{currencyFormat(props.price)}</Text>
            </View>
          ) : (
            <View style={[cProductSearchStyles.lowContainer]}>
              <Text># {props.code}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
