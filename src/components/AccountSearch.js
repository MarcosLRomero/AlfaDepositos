import { Image, Text, TouchableOpacity, View } from "react-native";

import iconAccount from "@icons/account.png";

import { cAccountSearchStyles } from "@styles/AccountStyle";

export default function AccountSearch({ name, code, priceClass, lista, functionCall }) {
  return (
    <TouchableOpacity
      onPress={() => {
        // console.log("LIST", lista)
        functionCall(code, name, priceClass, lista);
      }}
    >
      <View style={[cAccountSearchStyles.container]}>
        <Image source={iconAccount} style={[cAccountSearchStyles.image]} />
        <View>
          <Text>{name}</Text>
          <Text>{code}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
