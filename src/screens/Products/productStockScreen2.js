import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import StorageStockInfo from "@components/StorageStockInfo";
import iconStock from "@icons/stock.png";
import { stockScreenStyles } from "@styles/ProductStyle";
import { getProductStock } from "../../services/product";
import Colors from "@styles/Colors";

export default function ProductStockScreen({ navigation, route }) {
  const { code = null, name = null } = route?.params || {};

  const [isEmpty, setIsEmpty] = useState(false);
  const [storageInfo, setStorageInfo] = useState([]);
  const [statusResponse, setStatusResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Estados del Formulario
  const [newQuantity, setNewQuantity] = useState("");
  const [observation, setObservation] = useState("");

  async function loadStockOnline() {
    setIsLoading(true);
    try {
      const data = await getProductStock(code);

      if (data.status_code === 200 && data.data.length > 0) {
        setStorageInfo(data.data);

        // BUSQUEDA DEL VALOR REAL:
        // Buscamos en el array el objeto cuyo depósito sea "@REAL"
        const depositoReal = data.data.find(item => item.deposito === "@REAL");

        if (depositoReal) {
          // Si lo encuentra, limpiamos los decimales si son .00
          let valor = depositoReal.stock;
          if (valor.endsWith(".00")) {
            valor = valor.replace(".00", "");
          }
          setNewQuantity(valor);
        } else {
          // Si no existe "@REAL", usamos el primero de la lista por seguridad
          setNewQuantity(data.data[0].stock.replace(".00", ""));
        }

      } else {
        setIsEmpty(true);
        setStatusResponse(data.message || "No hay información disponible");
      }
    } catch (error) {
      console.error(error);
      setStatusResponse("Error al cargar stock");
      setIsEmpty(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStockOnline();
  }, []);

  const handleSaveInventory = async () => {
    if (newQuantity === "") {
      Alert.alert("Atención", "La cantidad no puede estar vacía");
      return;
    }
    // Lógica para guardar...
    Alert.alert("Guardado", `Se registró una cantidad de ${newQuantity}`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={[stockScreenStyles.container]}>

          {/* Cabecera */}
          <View style={styles.header}>
            <Image style={[stockScreenStyles.image]} source={iconStock} />
            <View style={[stockScreenStyles.containerTitle, { flex: 1 }]}>
              <Text style={[stockScreenStyles.title]}>Toma de Inventario # {code}</Text>
              <Text style={[stockScreenStyles.titleName]}>{name?.trim()}</Text>
            </View>
          </View>

          {/* Estado de Carga */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.DBLUE} />
              <Text style={styles.loaderText}>Consultando stock...</Text>
            </View>
          ) : (
            <>
              {/* Listado de depósitos (Solo si no está vacío) */}
              {!isEmpty && (
                <View style={styles.stockListContainer}>
                  <Text style={styles.sectionTitle}>Stock por Depósito:</Text>
                  {storageInfo.map((item, index) => (
                    <StorageStockInfo
                      key={index}
                      stock={item.stock}
                      name={item.deposito}
                    />
                  ))}
                </View>
              )}

              {/* Mensaje si no hay datos pero ya terminó de cargar */}
              {isEmpty && (
                <Text style={stockScreenStyles.labelError}>{statusResponse}</Text>
              )}

              {/* FORMULARIO: Solo aparece cuando NO está cargando */}
              <View style={styles.formContainer}>
                <View style={styles.card}>
                  <Text style={styles.label}>Cantidad Contada (REAL):</Text>
                  <TextInput
                    style={styles.inputQuantity}
                    value={newQuantity}
                    onChangeText={setNewQuantity}
                    keyboardType="numeric"
                    placeholder="0"
                    selectTextOnFocus={true} // Facilita borrar el valor precargado al tocar
                  />

                  <Text style={styles.label}>Observaciones:</Text>
                  <TextInput
                    style={styles.inputObs}
                    value={observation}
                    onChangeText={setObservation}
                    placeholder="Escriba aquí algún detalle del ajuste..."
                    multiline={true}
                    numberOfLines={3}
                  />

                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={handleSaveInventory}
                  >
                    <Text style={styles.btnText}>GUARDAR AJUSTE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  loaderContainer: {
    marginVertical: 40,
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic'
  },
  stockListContainer: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  formContainer: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    // Sombra para Android/iOS
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.DBLUE,
    marginBottom: 8
  },
  inputQuantity: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    padding: 12,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#212529',
    marginBottom: 20
  },
  inputObs: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 25
  },
  btnConfirm: {
    backgroundColor: Colors.DBLUE,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  }
});