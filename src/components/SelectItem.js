import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

export default function SelectItem(props) {
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    if (props?.defaultValue != '') {
      setTextValue(props?.defaultValue)
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>{props.title}</Text>
        <View style={styles.containerPicker}>
          <TextInput
            value={props?.reset ? "" : textValue}
            keyboardType={props.keyboardType ? props.keyboardType : "default"}
            placeholder={props.placeholder}
            key={props?.inputKey}
            ref={props?.inputRef}
            onSubmitEditing={props?.onSubmitEditingFn}
            returnKeyType={props?.returnKeyType}
            onChangeText={(text) => {
              props.changeTextFn(text);
              setTextValue(text);
            }}
          />
          {props.data.length > 0 && (
            <SafeAreaView style={{ flex: 1 }}>
              {props.data.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={"" + item.id}
                    style={styles.touchable}
                    onPress={() => {
                      props.saveState(item[props.fieldCode]);
                      setTextValue(item[props.fieldName]);
                      props.resetDataFn([]);
                      if (props.extraFnOnChange) {
                        props.extraFnOnChange();
                      }
                    }}
                  >
                    <Text>{item[props.fieldName]}</Text>
                  </TouchableOpacity>
                );
              })}
            </SafeAreaView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  picker: {
    width: "100%",
  },
  containerPicker: {
    borderWidth: 2,
    borderColor: "#e1e1e1",
    padding: 10,
  },
  touchable: {
    paddingVertical: 10,
    marginVertical: 5,
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
  },
});
