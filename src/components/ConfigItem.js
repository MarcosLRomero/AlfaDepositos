import CheckBox from "expo-checkbox";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ConfigItem(props) {
  return (
    <View>
      {props.type == "input" ? (
        <View>
          <Text style={styles.textTitle}>{props.title}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={props.placeholder}
            onChangeText={(text) => props.handleChange(props.field, text)}
            value={props.value}
            keyboardType={props.keyboardType ? props.keyboardType : "default"}
          />
        </View>
      ) : props.type == "checkbox" ? (
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={props.value}
            onValueChange={(text) => props.handleChange(props.field, text)}
            style={styles.checkbox}
          />
          <Text style={styles.label}>{props.title}</Text>
        </View>
      ) : (
        <Text></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  textInput: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: "#000",
    borderWidth: 1,
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
