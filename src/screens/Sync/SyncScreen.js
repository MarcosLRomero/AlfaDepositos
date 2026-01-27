import { useContext, useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
// import { useNetInfo } from "@react-native-community/netinfo";

import SyncItem from "@components/SyncItem";

import Category from "@db/Category";
import Configuration from "@db/Configuration";
import Account from "@db/Account";
import Family from "@db/Family";
import { bulkInsert } from "@db/Functions";
import Order from "@db/Order";
import OrderDetail from "@db/OrderDetail";
import Payment from "@db/Payment";
import PaymentInvoices from "@db/PaymentInvoices";
import PaymentMethods from "@db/PaymentMethods";
import PaymentMethod from "@db/PaymentMethod";
import Product from "@db/Product";
import Seller from "@db/Seller";
import Location from "@db/Location";
import Service from "@db/Service";
import Task from "@db/Task";
import Visit from "@db/Visit";
import VisitDetails from "@db/VisitDetails";
import { getDataFromAPI } from "@libraries/api";

import iconSync from "@icons/sync.png";

import { syncStyle } from "@styles/SyncStyle";

import { UserContext } from "@context/UserContext";
import ProductLista from "../../libraries/db/ProductLista";

export default function SyncScreen({ navigation, route }) {

  const { firstIn = null } = route?.params || {}


  const [login, loginAction] = useContext(UserContext);
  // const netInfo = useNetInfo();

  const [errorSync, setErrorSync] = useState("");
  const [showButtonSync, setShowButtonSync] = useState(true);
  const [final, setFinal] = useState(false);

  const [showLoaderConfig, setShowLoaderConfig] = useState(true);
  const [showLoaderRubro, setShowLoaderRubro] = useState(true);
  const [showLoaderFamilia, setShowLoaderFamilia] = useState(true);
  const [showLoaderVendedor, setShowLoaderVendedor] = useState(true);
  const [showLoaderPayments, setShowLoaderPayments] = useState(true);
  const [showLoaderServices, setShowLoaderServices] = useState(true);

  const [showLoaderDatosVisita, setShowLoaderDatosVisita] = useState(true);
  const [showLoaderClientes, setShowLoaderClientes] = useState(true);
  const [showLoaderArticulos, setShowLoaderArticulos] = useState(true);
  const [showLoaderArticulosListas, setShowLoaderArticulosListas] = useState(true);

  const createTables = async () => {
    // await Payment.dropTable();
    await Location.createTable();
    await Category.createTable();
    await Account.createTable();
    await Family.createTable();
    await Order.createTable();
    await OrderDetail.createTable();
    await Payment.createTable();
    await PaymentMethods.createTable();
    await PaymentInvoices.createTable();

    await PaymentMethod.createTable();
    await Product.createTable();
    await ProductLista.createTable();
    await Seller.createTable();
    await Service.createTable();
    // await Task.dropTable();
    await Task.createTable();
    await Visit.createTable();
    await VisitDetails.createTable();
  };

  async function syncData() {
    setShowButtonSync(false);

    await createTables();

    let props = {};
    let objectArray = [];
    let data;

    //Configuración del vendedor
    data = await getDataFromAPI(`seller/config/${login.user.user ?? "1"}`);

    if (!data.error) {
      data.data.map((item) => {
        Configuration.setConfigValue(item.key, item.value);
        // Configuration.setConfigValue(item.key, item.value == "SI" ? 1 : 0);
      });
      updateStatus("configuration");
    } else {
      setErrorSync(data.message);
      return;
    }

    // Rubros
    // Category.createTable();
    Category.destroyAll();

    data = await getDataFromAPI("category/");

    if (!data.error) {
      data.data.map((item) => {
        props = {
          code: item.codigo,
          name: item.descripcion,
        };
        objectArray.push(props);
      });

      bulkInsert("categories", objectArray);
      updateStatus("rubros");
    } else {
      setErrorSync(data.message);
      return;
    }

    //Familias
    // Family.createTable();
    Family.destroyAll();

    objectArray = [];

    data = await getDataFromAPI("family/");
    if (!data.error) {
      data.data.map((item) => {
        props = {
          code: item.codigo,
          name: item.descripcion,
        };
        objectArray.push(props);
      });

      bulkInsert("families", objectArray);
      updateStatus("familias");
    } else {
      setErrorSync(data.message);
      return;
    }

    //Vendedores
    // Seller.createTable();
    Seller.destroyAll();
    objectArray = [];
    data = await getDataFromAPI("seller/");
    if (!data.error) {
      data.data.map((item) => {
        props = {
          code: item.idvendedor,
          name: item.nombre,
          password: item.clave,
        };
        objectArray.push(props);
      });

      bulkInsert("sellers", objectArray);
      updateStatus("vendedores");
    } else {
      setErrorSync(data.message);
      return;
    }

    //Medios de Pago
    // PaymentMethod.createTable();
    PaymentMethod.destroyAll();
    objectArray = [];

    data = await getDataFromAPI("cashbox/medios_pago");
    if (!data.error) {
      data.data.map((item) => {
        props = {
          code: item.codigo,
          name: item.descripcion,
        };
        objectArray.push(props);
      });

      bulkInsert("payments_methods", objectArray);
      updateStatus("mediosPago");
    } else {
      setErrorSync(data.message);
      return;
    }

    //Servicios
    // Service.createTable();
    Service.destroyAll();
    objectArray = [];

    data = await getDataFromAPI("service/");
    if (!data.error) {
      data.data.map((item) => {
        props = {
          code: item.codigo,
          name: item.descripcion,
        };
        objectArray.push(props);
      });

      bulkInsert("services", objectArray);
      updateStatus("servicios");
    } else {
      setErrorSync(data.message);
      return;
    }

    //Visitas getVisitasVendedor/codvdor/coddia
    const dayNumber = new Date().getDay();

    // Visit.dropTable();
    // Visit.createTable();
    Visit.destroyAll();
    // VisitDetails.destroyAll();
    objectArray = [];

    data = await getDataFromAPI(`seller/visitas/${login.user.user ?? "1"}/${dayNumber}`);
    if (!data.error) {
      data.data.map((item) => {
        props = {
          account: item.cliente,
          name: item.nombre,
          obs: item.observaciones,
          monday: item.lunes,
          tuesday: item.martes,
          wednesday: item.miercoles,
          thursday: item.jueves,
          friday: item.viernes,
          saturday: item.sabado,
          sunday: item.domingo,
          order_visit: item.orden,
        };
        objectArray.push(props);
      });

      bulkInsert("visits", objectArray);
      updateStatus("visitas");
    } else {
      setErrorSync(data.message);
      return;
    }

    //Proveedores
    Account.destroyAll();
    let pages = 50;

    for (let page = 1; page <= pages; page++) {
      data = await getDataFromAPI(`account/paginate/${page}`);

      objectArray = [];
      if (!data.error) {
        if (Object.keys(data.data).length == 0) {
          updateStatus("proveedores");
          break;
        } else {
          data.data.map((item) => {
            props = {
              code: item.codigo,
              optional_code: item.codigo_opcional,
              name: item.razon_social,
              address: item.calle,
              location: item.localidad,
              cuit: item.cuit,
              iva: item.iva,
              price_class: item.clase,
              discount_perc: item.dto,
              tc_default: item.cpte_default,
              id_seller: item.idvendedor,
              phone: item.telefono,
              mail: item.email,
              lista: item.lista,
            };

            objectArray.push(props);
          });
        }

        bulkInsert("accounts", objectArray);
      } else {
        setErrorSync(data.message);
        return;
      }
    }

    updateStatus("proveedores");

    //Articulos
    Product.destroyAll();
    pages = 150;

    for (let page = 1; page <= pages; page++) {
      data = await getDataFromAPI(`product/paginate/${page}`);

      objectArray = [];
      if (!data.error) {
        if (Object.keys(data.data).length == 0) {
          updateStatus("articulos");
          break;
        } else {
          data.data.map((item) => {
            props = {
              code: item.idarticulo,
              codigoBarras: item?.codigobarras,
              name: item.descripcion,
              category: item.idrubro,
              family: item.idfamilia,
              internal_taxes: item.imp_internos,
              iva: item.iva,
              exempt: item.exento,
              price1: item.precio1,
              price2: item.precio2,
              price3: item.precio3,
              price4: item.precio4,
              price5: item.precio5,
              price6: item.precio6,
              price7: item.precio7,
              price8: item.precio8,
              price9: item.precio9,
              price10: item.precio10,
              cant_propuesta: item?.cantidadpropuesta,
            };

            objectArray.push(props);
          });
        }
        bulkInsert("products", objectArray);
      } else {
        setErrorSync(data.message);
        return;
      }
    }
    updateStatus("articulos");


    //Listas de precios
    ProductLista.destroyAll();
    pages = 150;

    for (let page = 1; page <= pages; page++) {
      data = await getDataFromAPI(`product/paginate/listas/${page}`);

      objectArray = [];
      if (!data.error) {
        if (Object.keys(data.data).length == 0) {
          updateStatus("articulos_listas");
          break;
        } else {
          data.data.map((item) => {
            props = {
              code: item.idarticulo,
              codigoBarras: item?.codigobarras,
              name: item.descripcion,
              lista: item.lista,
              price1: item.precio1,
              price2: item.precio2,
              price3: item.precio3,
              price4: item.precio4,
              price5: item.precio5,
              price6: item.precio6,
              price7: item.precio7,
              price8: item.precio8,
              price9: item.precio9,
              price10: item.precio10,
              cant_propuesta: item?.cantidadpropuesta,
            };

            objectArray.push(props);
          });
        }
        bulkInsert("products_listas", objectArray);
      } else {
        setErrorSync(data.message);
        return;
      }
    }
    updateStatus("articulos_listas");

    if (!errorSync) {
      setFinal(true);
    }
  }

  function updateStatus(tbl) {
    if (tbl == "rubros") {
      setShowLoaderRubro(false);
    } else if (tbl == "familias") {
      setShowLoaderFamilia(false);
    } else if (tbl == "vendedores") {
      setShowLoaderVendedor(false);
    } else if (tbl == "articulos") {
      setShowLoaderArticulos(false);
    } else if (tbl == "proveedores") {
      setShowLoaderClientes(false);
    } else if (tbl == "visitas") {
      setShowLoaderDatosVisita(false);
    } else if (tbl == "mediosPago") {
      setShowLoaderPayments(false);
    } else if (tbl == "servicios") {
      setShowLoaderServices(false);
    } else if (tbl == "configuration") {
      setShowLoaderConfig(false);
    } else if (tbl == "articulos_listas") {
      setShowLoaderArticulosListas(false)
    }
  }

  const configVerify = async () => {
    const data = await Configuration.getConfigAPI();

    const API_URI = data.find((item) => item.key == "API_URI");

    if (API_URI === undefined) {
      Alert.alert("Configurar", "Debe configurar los datos de la API para continuar.", [
        {
          text: "Cancelar",
          onPress: () => {
            navigation.goBack(null);
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("ConfigurationScreen");
          },
        },
      ]);
    }
  };

  useEffect(() => {
    configVerify();
  }, []);

  return (
    <View style={[syncStyle.container]}>
      <Text style={[syncStyle.text]}>
        El proceso de sincronización, descargará la información de vendedores, articulos, proveedores y rubros. Este proceso puede demorar varios
        minutos, dependiendo de la cantidad de registros y su conexión a internet.
      </Text>
      <Image style={[syncStyle.image]} source={iconSync} />

      {/* {!netInfo.isConnected && <Text style={{ marginBottom: 10, color: "red" }}>No dispone de conexión a internet</Text>} */}

      {showButtonSync ? (
        <TouchableOpacity activeOpacity={.7} style={[syncStyle.btnSync]} onPress={syncData}>
          {/* <TouchableOpacity activeOpacity={.7} disabled={!netInfo.isConnected} style={[syncStyle.btnSync]} onPress={syncData}> */}
          <Text style={[syncStyle.textBtnSync]}>Sincronizar</Text>
        </TouchableOpacity>
      ) : errorSync ? (
        <Text style={[syncStyle.errorMessage]}>{errorSync}</Text>
      ) : (
        <ScrollView>
          <SyncItem showLoader={showLoaderConfig} text="Configuración"></SyncItem>
          <SyncItem showLoader={showLoaderRubro} text="Rubros"></SyncItem>
          <SyncItem showLoader={showLoaderFamilia} text="Familias"></SyncItem>
          <SyncItem showLoader={showLoaderVendedor} text="Vendedores"></SyncItem>
          <SyncItem showLoader={showLoaderPayments} text="Medios de Pago"></SyncItem>
          <SyncItem showLoader={showLoaderServices} text="Servicios"></SyncItem>
          <SyncItem showLoader={showLoaderDatosVisita} text="Datos Visita"></SyncItem>
          <SyncItem showLoader={showLoaderClientes} text="Proveedores"></SyncItem>
          <SyncItem showLoader={showLoaderArticulos} text="Articulos"></SyncItem>
          <SyncItem showLoader={showLoaderArticulosListas} text="Listas"></SyncItem>
        </ScrollView>
      )}

      {final ? (
        <View style={[syncStyle.finalText]}>
          <Text>Sincronización finalizada</Text>
          <TouchableOpacity
            style={[syncStyle.btnReturn]}
            onPress={() => (firstIn ? navigation.navigate("LoginScreen") : navigation.navigate("HomeScreen"))}
          >
            <Text style={[syncStyle.textBtnReturn]}>Regresar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text></Text>
      )}
    </View>
  );
}
