import iconMap from "@icons/map.png";
import iconVisited from "@icons/ok.png";
import iconPending from "@icons/pending.png";
import { useContext, useState } from "react";
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

import { UserContext } from "@context/UserContext";
import VisitDetails from "@db/VisitDetails";

import { itemVisitStyle } from "@styles/VisitsStyle";
import CheckBox from "expo-checkbox";
import { formatDate } from "@libraries/utils";

export default function ItemVisit({ navigation, item }) {
  const [login, loginAction] = useContext(UserContext);
  // console.log(item)
  const { account, name, address, phone, location, obs, obs_details, visited, idVisited, qty_orders } = item;

  const [error, setError] = useState(null)
  //   console.log(qty_orders);

  const [modalVisible, setModalVisible] = useState(false);
  const [dataVisit, setDataVisit] = useState({
    visited: visited,
    obs: obs_details || "",
    account: account,
    seller: login.user.user,
    date: formatDate(new Date(), true, false),
    isSaved: idVisited > 0,
  });

  let full_address = "";
  full_address = address != "" && address != null ? address.trim() : "";
  full_address +=
    location != "" && location != null ? (address != "" ? ", " : "") + location.trim() : full_address;

  const handleSave = async () => {

    if (dataVisit?.obs?.trim() == '' || dataVisit?.obs == null) {
      setError("Debe informar la observación")
      return
    }

    setError(null)

    // console.log(dataVisit)
    // console.log(idVisited)

    if (idVisited > 0) {
      const visit = await VisitDetails.find(idVisited);
      visit.visited = dataVisit.visited ? dataVisit.visited : false;
      visit.obs = dataVisit.obs.trim();
      visit.date = formatDate(new Date(), true, false);
      visit.save();
    } else {
      // console.log(dataVisit)

      dataVisit.visited = dataVisit.visited != null ? dataVisit.visited : false;

      // console.log(dataVisit)
      const visit = new VisitDetails(dataVisit);
      visit.save();
      setDataVisit({ ...dataVisit, isSaved: true });
    }

    setModalVisible(false);
  };

  return (
    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
      <View style={[itemVisitStyle.mainContainer]}>
        <View style={[itemVisitStyle.container]}>
          <View style={[itemVisitStyle.infoContainer]}>
            <Image source={iconMap} style={[itemVisitStyle.icon]} />
            <View>
              <Text style={[itemVisitStyle.smallText]}>
                {account} (Pedidos cargados : {qty_orders})
              </Text>
              <Text style={[itemVisitStyle.mediumText]}>
                {name?.length > 30 ? name?.substring(0, 30) + "..." : name}
              </Text>
              {full_address != "" && <Text style={[itemVisitStyle.smallText]}>{full_address}</Text>}
              {phone != "" && <Text style={[itemVisitStyle.smallText]}>{phone}</Text>}
              {obs != "" && <Text style={[itemVisitStyle.smallText]}>{obs}</Text>}
              {dataVisit.obs != "" && dataVisit.isSaved && (
                <Text style={[itemVisitStyle.smallText]}>Observaciones : {dataVisit.obs}</Text>
              )}
            </View>
          </View>
          <View style={[itemVisitStyle.containerIconVisited]}>
            {dataVisit.visited ? (
              <Image source={iconVisited} style={[itemVisitStyle.iconStatus]} />
            ) : (
              <Image source={iconPending} style={[itemVisitStyle.iconStatus]} />
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[itemVisitStyle.btnNewOrder]}
          onPress={() => navigation.navigate("NewOrderScreen", { navigation, id: null, account: account })}
        >
          <Text style={[itemVisitStyle.textBtnNewOrder]}>Cargar pedido +</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={[itemVisitStyle.modalBody]}>
          <Text style={[itemVisitStyle.labelModal]}>{name}</Text>
          <View style={[itemVisitStyle.checkboxContainer]}>
            <CheckBox
              value={dataVisit.visited == 1}
              onValueChange={(value) => setDataVisit({ ...dataVisit, visited: value ? 1 : 0 })}
              style={[itemVisitStyle.checkbox]}
            />
            <Text style={[itemVisitStyle.label]}>Visitado</Text>
          </View>
          <TextInput
            style={[itemVisitStyle.obsInput]}
            placeholder="Observaciones"
            onChangeText={(text) => setDataVisit({ ...dataVisit, obs: text })}
            value={dataVisit.obs || ""}
          />

          {error && <Text style={{ color: "red" }}>{error}</Text>}

          <TouchableOpacity style={[itemVisitStyle.buttonSave]} onPress={handleSave}>
            <Text style={[itemVisitStyle.textButtonSave]}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={[itemVisitStyle.buttonCancel]}
          >
            <Text style={[itemVisitStyle.textButtonSave]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </TouchableOpacity>
  );
}
