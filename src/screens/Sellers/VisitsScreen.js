import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import ItemVisit from "@components/ItemVisit";
import Visit from "@db/Visit";
import { visitsScreenStyle } from "@styles/VisitsStyle";
import { useIsFocused } from "@react-navigation/native";

export default function VisitsScreen({ navigation }) {
  const [visits, setVisits] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState(null)
  const isFocused = useIsFocused();

  const loadVisits = async () => {
    setIsLoading(true);
    const data = await Visit.findByDay(searchText);
    // console.log(data)

    if (data.length > 0) {
      setVisits(data);
    }
    setIsEmpty(data.length == 0);
    setIsLoading(false);
  };

  useEffect(() => {
    loadVisits();
  }, [searchText, isFocused]);

  return (
    <SafeAreaView>
      <Text style={[visitsScreenStyle.title]}>Visitas del día de hoy</Text>

      {/* <View style={{ borderWith: 2, borderColor: "red", padding: 10 }}> */}
      <TextInput
        onChangeText={(text) => setSearchText(text)}
        placeholder="Buscar cliente"
        style={{ backgroundColor: "white", borderWith: 1, padding: 10, borderRadius: 10, marginHorizontal: 10, marginVertical: 10 }} />
      {/* </View> */}

      {isLoading ? (
        <ActivityIndicator style={[visitsScreenStyle.loader]} size="large" color="#00ff00" />
      ) : isEmpty ? (
        <Text style={[visitsScreenStyle.emptyText]}>No hay visitas para el día de hoy.</Text>
      ) : (
        <FlatList

          ListFooterComponent={
            <View>
              <Text style={[visitsScreenStyle.smallText]}>
                Toque un cliente para ingresar una observación
              </Text>
            </View>
          }
          ListFooterComponentStyle={{ height: 100 }}
          data={visits}
          keyExtractor={(item) => item.id + ""}
          renderItem={({ item }) => {
            if (item?.visited == false || item?.visited == null || item?.visited == '') {
              return <ItemVisit item={item} navigation={navigation} />;
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
