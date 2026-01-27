import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { listTasksStyles } from "@styles/TaskStyle";

import TaskItem from "@components/TaskItem";

import Task from "@db/Task";

export default function TasksScreen({ navigation }) {
  const [empty, setEmpty] = useState(false);
  const [tasks, setTasks] = useState([]);

  const loadLocalTasks = async () => {
    setEmpty(false);
    const data = await Task.findAll();
    setEmpty(data.length == 0);
    setTasks(data);
  };

  useEffect(() => {
    loadLocalTasks();
  }, [navigation]);

  return (
    <SafeAreaView style={[listTasksStyles.mainContainer]}>
      <View style={[listTasksStyles.container]}>
        <View>
          <TouchableOpacity
            style={[listTasksStyles.btnNewPayment]}
            onPress={() => navigation.navigate("NewTaskScreen")}
          >
            <Text style={[listTasksStyles.textBtn]}>Nueva tarea +</Text>
          </TouchableOpacity>
        </View>

        <View style={[listTasksStyles.titleContainer]}>
          <Text style={[listTasksStyles.title]}>Tareas pendientes de sincronización</Text>
          <Text style={[listTasksStyles.subtitle]}>Toque una tarea para editarla</Text>
        </View>

        {tasks.length > 0 ? (
          <FlatList
            ListFooterComponent={<View></View>}
            ListFooterComponentStyle={{ height: 100 }}
            scrollEnabled={true}
            style={[listTasksStyles.flatList]}
            data={tasks}
            keyExtractor={(item) => item.id + item.service_name}
            renderItem={({ item }) => {
              return (
                <TaskItem
                  account={item.account}
                  date={item.date}
                  document={item?.document}
                  name={item.accountName}
                  obs={item.obs}
                  id={item.id}
                  phone={item?.phone}
                  service_name={item.service_name}
                  navigation={navigation}
                ></TaskItem>
              );
            }}
          />
        ) : empty ? (
          <Text style={[listTasksStyles.emptyText]}>No hay tareas cargadas</Text>
        ) : (
          <ActivityIndicator style={[listTasksStyles.loader]} size="large" color="#00ff00" />
        )}
      </View>
    </SafeAreaView>
  );
}
