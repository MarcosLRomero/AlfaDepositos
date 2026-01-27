import AsyncStorage from "@react-native-async-storage/async-storage";

// const CART_KEY = "@cart:key";

async function setItem(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return JSON.stringify(value);
    } catch (error) {
        return "Error";
    }
}

async function getItem(key) {
    try {
        const item = await AsyncStorage.getItem(key);
        return JSON.parse(item);
    } catch (error) {
        return null;
    }
}

async function deleteItem(key) {
    try {
        await AsyncStorage.removeItem(key);
        const item = await AsyncStorage.getItem(key);
        return item == null ? "Cart removido" : "Cart no removido";
    } catch (error) {
        return "Error";
    }
}

export { setItem, getItem, deleteItem };
