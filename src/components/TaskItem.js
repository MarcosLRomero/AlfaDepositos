import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Task from "@db/Task";
import imgTask from "@icons/tasks.png";

export default function TaskItem(props) {
  const id = props.id
  const navigation = props.navigation

  const handleClic = async () => {  
    const task = await Task.findById(id);
    
    if (task.length > 0) {
      navigation.navigate("EditTaskScreen", { navigation, id });
    } else {
      return Alert.alert("Tarea inexistente", "Su tarea fue eliminada pero no se recargó la pantalla. ¿Desea recargar o ver los datos de la tarea eliminada antes?", [
        {
          text: "Recargar",
          onPress: () => {
            navigation.navigate("TasksScreen", { reload: true });
          },
        },
        {
          text: "Volver",
        },
      ]);
    }
  };

  let addedText = '';

  // Como son campos nuevos, alido si existen documento o teléfono
  if (props?.document) {
    addedText += ` - ${props?.document}`
  }

  if (props?.phone) {
    addedText += ` - ${props?.phone}`
  }

  return (
    <TouchableOpacity onPress={() => { handleClic() }}>
      <View style={styles.container}>
        <View>
          <Image style={styles.image} source={imgTask}></Image>
        </View>

        <View style={styles.highContainer}>
          <View>
            <Text>{props.name}{addedText}</Text>
          </View>
          <View style={styles.lowContainer}>
            <Text>
              {props.date} - {props.service_name}
            </Text>
          </View>
          <View>
            <Text>{props.obs}</Text>
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
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 2,
  },
  image: {
    width: 40,
    height: 40,
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
  price: {
    textAlign: "right",
  },
});
