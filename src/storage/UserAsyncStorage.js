import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@user:key";

async function setUser(user) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return JSON.stringify(user);
  } catch (error) {
    return "Error";
  }
}

async function getUser() {
  try {
    const item = await AsyncStorage.getItem(USER_KEY);
    return JSON.parse(item);
  } catch (error) {
    return null;
  }
}

async function deleteUser() {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    const item = await AsyncStorage.getItem(USER_KEY);
    return item == null ? "Usuario removido" : "Usuario no removido";
  } catch (error) {
    return "Error";
  }
}

export { setUser, getUser, deleteUser };
