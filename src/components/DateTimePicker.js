import DateTimePicker from "@react-native-community/datetimepicker";
import { View } from "react-native";

export default function CDateTimePicker(props) {
  return (
    <View>
      <DateTimePicker
        testID="dateTimePicker"
        value={props.date}
        mode="date"
        display="default"
        is24Hour={true}
        onChange={props.changeFunction}
      />
    </View>
  );
}
