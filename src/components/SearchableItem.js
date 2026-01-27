import { Image, Text, TouchableOpacity, View } from "react-native";

import imgProduct from "@icons/product2.png";
import { cProductSearchStyles } from "@styles/ProductStyle";

export default function SearchableItem(props) {
  return (
    <View style={[cProductSearchStyles.mainContainer]}>
      <TouchableOpacity onPress={() => props.functionCall(props.code, props.name, props.price)}>
        <View style={[cProductSearchStyles.container]}>
          <Image style={[cProductSearchStyles.image]} source={imgProduct}></Image>

          <View style={[cProductSearchStyles.highContainer]}>
            <View>
              <Text>{props.name}</Text>
            </View>
            {props.showAmount == 1 ? (
              <View style={[cProductSearchStyles.lowContainer]}>
                <Text># {props.code}</Text>
                <Text style={[cProductSearchStyles.price]}>$ {props.price}</Text>
              </View>
            ) : (
              <View style={[cProductSearchStyles.lowContainer]}>
                <Text># {props.code}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
