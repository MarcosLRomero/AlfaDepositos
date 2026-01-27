import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View, TouchableOpacity } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { listAccountStyles } from "@styles/AccountStyle";

import AccountItem from "@components/AccountItem";
import { UserContext } from "@context/UserContext";
import Account from "@db/Account";

export default function Accounts({ navigation }) {
  const [login, loginAction] = useContext(UserContext);

  const [accounts, setAccounts] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccounts = async (text = "") => {
    setIsLoading(true);

    const data = await Account.getAll(login.user.user, text);

    setIsEmpty(data.length == 0);
    setAccounts(data.length == 0 ? [] : data);

    setIsLoading(false);
  };

  const handleSearch = async (text) => {
    if (text.length >= 3 || text.length == 0) {
      loadAccounts(text);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <SafeAreaView>
      <View style={[listAccountStyles.viewSearch]}>
        <TouchableOpacity style={[listAccountStyles.btnNewAccount]} onPress={() => navigation.navigate("NewAccountScreen")}>
          <Text style={[listAccountStyles.textBtnNewAccount]}>Nuevo cliente +</Text>
        </TouchableOpacity>
        <TextInput
          style={[listAccountStyles.textSearch]}
          onChangeText={(text) => handleSearch(text)}
          placeholder="Buscar por código o descripción"
        ></TextInput>
      </View>

      {isLoading ? (
        <ActivityIndicator style={[listAccountStyles.loader]} size="large" color="#00ff00" />
      ) : isEmpty ? (
        <Text style={[listAccountStyles.emptyText]}>No hay proveedores.</Text>
      ) : (
        <FlatList
          ListFooterComponent={<View></View>}
          ListFooterComponentStyle={{ height: 100 }}
          scrollEnabled={true}
          data={accounts}
          keyExtractor={(item) => item.code + item.id + ""}
          renderItem={({ item }) => {
            return (
              <AccountItem
                name={item.name}
                code={item.code}
                id={item.id}
                navigation={navigation}
              ></AccountItem>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
