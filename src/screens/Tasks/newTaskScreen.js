import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { newTaskStyles } from "@styles/TaskStyle";
import { newOrderStyles } from "@styles/OrderStyle";
import Colors from "@styles/Colors";

import CDateTimePicker from "@components/DateTimePicker";
import InputDate from "@components/InputDate";
import SelectItem from "@components/SelectItem";
import ImagePick from "@components/ImagePicker";
import ImageSlider from "@components/ImageSlider";
import { formatDate } from "@libraries/utils";

import Account from "@db/Account";
import Service from "@db/Service";
import Task from "@db/Task";

import { UserContext } from "@context/UserContext";
import { AntDesign, Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import Signature from "react-native-signature-canvas";

import usePrintAndShare from "@hooks/usePrintAndShare";
import useTemplateShare from "@hooks/useTemplateShare";
import { manipulateAsync } from "expo-image-manipulator";

export default function NewTaskScreen({ navigation, route }) {
  const [login, loginAction] = useContext(UserContext);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  // const [isEditImage, setIsEditImage] = useState(false);

  const [date, setDate] = useState(new Date());
  const [dateString, setDateString] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [sAccount, setSAccount] = useState({
    name: '',
    onTaskName: '',
    phone: '',
    document: ''
  })

  const [service, setService] = useState({
    name: '',
    code: '',
  })

  const [selectAccount, setSelectAccount] = useState("");
  const [selectService, setSelectService] = useState("");

  const [obs, setObs] = useState("");
  const [services, setServices] = useState([]);

  const [signature, setSignature] = useState(null);
  const [image, setImage] = useState([]);
  const [imageCompressed, setImageCompressed] = useState([]);

  const { id = null } = route?.params || {}


  const { generatePdf } = usePrintAndShare();
  const { getTemplate } = useTemplateShare();

  const searchAccount = async (name) => {
    try {
      const data = await Account.getAll(login.user.user, name, 10);
      setAccounts(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const searchService = async (name) => {
    try {
      if (name == "") {
        const data = await Service.query({ page: 1, limit: 5 });
        setServices(data);
      } else {
        const data = await Service.findLikeName(name);
        setServices(data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const handleChangeDate = (event, selectedDate) => {
    let currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(formatDate(currentDate));
    setDateString(formatDate(currentDate, true));
  };

  const showDatepicker = () => {
    setShow(true);
    Keyboard.dismiss();
  };

  const handleSave = async (isShare = false) => {
    // console.log('handleSave');

    setError("");
    if (dateString == "") {
      setError("Debe informar la fecha");
      return;
    }

    if (selectAccount === "") {
      setError("Debe informar el cliente");
      return;
    }

    if (selectService == "") {
      setError("Debe informar el servicio");
      return;
    }

    if (sAccount?.name == '') {
      setError("Debe informar el nombre");
      return;
    }

    setSaving(true);

    let image1a = null;
    let image1b = null;
    let image2a = null;
    let image2b = null;
    let image3a = null;
    let image3b = null;
    let image4a = null;
    let image4b = null;
    let image5a = null;
    let image5b = null;

    if (image) {
      for (let i = 0; i < image.length; i++) {
        const base64 = image[i];
        const middleIndex = Math.floor(base64.length / 2);

        // console.log(middleIndex);

        // worst logic in history probably 👽
        switch (i) {
          case 0:
            image1a = base64.substring(0, middleIndex);
            image1b = base64.substring(middleIndex);
            // console.log('Cargando image1');
            break;
          case 1:
            image2a = base64.substring(0, middleIndex);
            image2b = base64.substring(middleIndex);
            // console.log('Cargando image2');
            break;
          case 2:
            image3a = base64.substring(0, middleIndex);
            image3b = base64.substring(middleIndex);
            // console.log('Cargando image3');
            break;
          case 3:
            image4a = base64.substring(0, middleIndex);
            image4b = base64.substring(middleIndex);
            // console.log('Cargando image4');
            break;
          case 4:
            image5a = base64.substring(0, middleIndex);
            image5b = base64.substring(middleIndex);
            // console.log('Cargando image5');
            break;
        }
      }
    }

    const payload = {
      account: selectAccount,
      date: dateString,
      document: sAccount?.document,
      accountName: sAccount?.onTaskName,
      obs: obs,
      phone: sAccount?.phone,
      service: selectService,
      seller: login.user.user,
      sign: signature,
      image1a: image1a,
      image1b: image1b,
      image2a: image2a,
      image2b: image2b,
      image3a: image3a,
      image3b: image3b,
      image4a: image4a,
      image4b: image4b,
      image5a: image5a,
      image5b: image5b,
    };

    // console.log(payload)

    // console.log('image1a:', image1a.length);
    // console.log('image1b:', image1b.length);

    try {
      if (isEditTask) {
        payload.id = id;

        await Task.update(payload);
      } else {

        try {
          const task = new Task(payload);
          if (task.save()) {
            navigation.navigate("TasksScreen", { reload: true });
          } else {
            setError("Error al generar la tarea");
          }

          if (isShare) {
            const account = await Account.findBy({ code_eq: selectAccount });
            payload.accountName = sAccount?.name ? sAccount.name : (account ? account.name : "");

            const service = await Service.findBy({ code_eq: selectService });
            payload.serviceName = service ? service.name : "";

            payload.sellerName = login.user.name;

            const html = await getTemplate("task", {
              payload,
            });

            generatePdf(html);
          }

        } catch (e) {

          console.error(e);
          return Alert.alert("Error", error.message);

        }
      }

      navigation.navigate("TasksScreen", { reload: true });

    } catch (error) {

      console.error(e);
      return Alert.alert("Error", error.message);

    }
  };

  const handleOK = (signature) => {
    setSignature(signature);
  };

  const handleEmpty = () => {
    setError("Debe informar la firma para poder guardarla");
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
      margin-bottom: 10px;
    }`;

  const fetchDataAccount = async () => {
    try {
      const [data] = await Account.getDataAccount(selectAccount);

      setSAccount({
        name: data?.name,
        onTaskName: data?.name,
        document: data?.cuit,
        phone: data?.phone
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  }

  const setNameByAccount = async (account) => {
    try {
      const account = await Account.findBy({ code_eq: account });
      setSAccount({ ...sAccount, onTaskName: account?.name });

    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  }

  useEffect(() => {
    if (selectAccount && !isEditTask) {
      fetchDataAccount();
    }
  }, [selectAccount]);

  // useEffect(() => {
  //   console.log('image', image);
  //   console.log('imageCompressed', imageCompressed);
  // }, [image, imageCompressed]);

  const loadTaskFromDb = async () => {
    setIsLoading(true);

    try {
      const [task] = await Task.findById(id);
      const account = await Account.findBy({ code_eq: task?.account });
      const sc = await Service.findBy({ code_eq: task?.service });

      // console.log(task);

      setIsEditTask(true);
      setDateString(task?.date);

      setSAccount({
        name: account?.name,
        onTaskName: task?.accountName,
        document: task?.document,
        phone: task?.phone,
      });

      setService({
        name: sc?.name,
        code: sc?.code,
      });

      setSelectService(task?.service);
      setObs(task?.obs);
      setSignature(task?.sign);

      setSelectAccount(task?.account);

      const images = [
        task?.image1a ? `${task?.image1a}${task?.image1b}` : '',
        task?.image2a ? `${task?.image2a}${task?.image2b}` : '',
        task?.image3a ? `${task?.image3a}${task?.image3b}` : '',
        task?.image4a ? `${task?.image4a}${task?.image4b}` : '',
        task?.image5a ? `${task?.image5a}${task?.image5b}` : '',
      ];

      setImage(images);

      const compressedImages = await Promise.all(
        images.map(async (image) => {
          if (image) {
            const compressedImage = await compressImageFromBase64(image);
            return compressedImage.base64;
          }
          return '';
        })
      );

      setImageCompressed(compressedImages);

      // console.log(images[0].length)
      // console.log(compressedImages[0].length)

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  }

  useEffect(() => {

    if (id) {
      loadTaskFromDb(id);
    }
  }, []);

  const deleteTask = async () => {
    try {

      await Task.destroy(id);
      navigation.navigate("TasksScreen", { reload: true });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteTask = () => {
    return Alert.alert("¿Eliminar?", "¿Está seguro que desea eliminar la tarea? No se podrá recuperar.", [
      {
        text: "Si",
        onPress: () => {
          deleteTask();
        },
      },
      {
        text: "No",
      },
    ]);
  };

  const compressImageFromBase64 = async (base64) => {
    const uri = `data:image/jpeg;base64,${base64}`;
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 600 } }], // Cambiar el tamaño de la imagen
      { compress: 0.1, format: 'jpeg', base64: true } // Reducir la calidad y obtener base64 comprimido
    );
    return manipResult;
  };

  return (
    <>
      <SafeAreaView style={[newTaskStyles.mainContainer]}>
        {isLoading ?
          <View style={[newTaskStyles.loaderCentered]}>
            <ActivityIndicator size="large" color={Colors.BLUE} />
          </View>
          :
          <View style={[newTaskStyles.container]}>
            <ScrollView scrollEnabled={scrollEnabled} style={[newTaskStyles.containerScroll]}>
              <View style={[newTaskStyles.containerDates]}>
                <InputDate
                  fullWidth={true}
                  title="Fecha"
                  value={dateString}
                  callback={showDatepicker}
                ></InputDate>
              </View>

              <SelectItem
                style={[newTaskStyles.element]}
                title="Cliente"
                data={accounts}
                defaultValue={sAccount?.name}
                saveState={(value) => { setSelectAccount(value); setNameByAccount(value) }}
                valueState={selectAccount}
                resetDataFn={setAccounts}
                fieldCode="code"
                fieldName="name"
                key={1}
                changeTextFn={searchAccount}
              ></SelectItem>

              {selectAccount &&
                <>
                  <View style={[newTaskStyles.element]}>
                    <Text>Nombre</Text>
                    <TextInput
                      value={sAccount?.onTaskName}
                      onChangeText={(text) => setSAccount({ ...sAccount, onTaskName: text })}
                      style={[newTaskStyles.textInput]}
                      placeholder="Nombre"
                    ></TextInput>
                  </View>

                  <View style={[newTaskStyles.element]}>
                    <Text>DNI o CUIT</Text>
                    <TextInput
                      value={sAccount?.document}
                      onChangeText={(text) => setSAccount({ ...sAccount, document: text })}
                      style={[newTaskStyles.textInput]}
                      placeholder="DNI o CUIT"
                    ></TextInput>
                  </View>

                  <View style={[newTaskStyles.element]}>
                    <Text>Teléfono</Text>
                    <TextInput
                      value={sAccount?.phone}
                      onChangeText={(text) => setSAccount({ ...sAccount, phone: text })}
                      style={[newTaskStyles.textInput]}
                      placeholder="Teléfono"
                    ></TextInput>
                  </View>
                </>
              }

              <SelectItem
                style={[newTaskStyles.element]}
                title="Servicio"
                data={services}
                defaultValue={service?.name}
                saveState={setSelectService}
                valueState={selectService}
                resetDataFn={setServices}
                fieldCode="code"
                fieldName="name"
                key={2}
                changeTextFn={searchService}
              ></SelectItem>

              <View style={[newTaskStyles.element]}>
                <Text>Observacion</Text>
                <TextInput
                  multiline={true}
                  numberOfLines={5}
                  value={obs}
                  onChangeText={(text) => setObs(text)}
                  style={[newTaskStyles.textInput]}
                ></TextInput>
              </View>

              <View style={[newTaskStyles.element]}>
                <Text style={[newTaskStyles.element]}>Imágenes</Text>

                <ImageSlider images={imageCompressed} />

                {imageCompressed?.length > 0 &&
                  <Text style={{ textAlign: 'center' }}>Imagen/es comprimida/s (solo en esta vista)</Text>
                }

                <ImagePick image={image} setImage={setImage} imageCompressed={imageCompressed} setImageCompressed={setImageCompressed} />

                {/* {!isEditTask || isEditImage
                  ?
                  <ImagePick image={image} setImage={setImage} />
                  :
                  <Image source={{ uri: image }} style={[newTaskStyles.image]} />
                  // <Carousel />
                } */}

                {/* {isEditTask &&
                  <TouchableOpacity style={[newTaskStyles.btnEdit]} onPress={() => setIsEditImage(!isEditImage)}>
                    <Ionicons name="image" color="white" size={18} />
                    <Text style={[newTaskStyles.textBtnSave]}>{isEditImage ? 'Cancelar' : 'Cambiar imagen'}</Text>
                  </TouchableOpacity>
                } */}
              </View>

              <View style={{ height: 370, marginBottom: 10 }}>
                <View style={{ height: "100%" }}>
                  {signature ? (
                    <>
                      <Text>Firma</Text>

                      <View style={styles.preview}>
                        <Image
                          resizeMode={"contain"}
                          style={{ width: "100%", height: 250 }}
                          source={{ uri: signature }}
                        />

                        {!isEditTask &&
                          <TouchableOpacity style={[newTaskStyles.btnSave]} onPress={() => setSignature(null)}>
                            <Text style={[newTaskStyles.textBtnSave]}>Registrar nueva firma</Text>
                          </TouchableOpacity>
                        }
                      </View>
                    </>
                  ) : (
                    <>
                      <Text>Firma</Text>
                      <Signature
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        descriptionText="Firma"
                        clearText="Borrar"
                        confirmText="Guardar"
                        webStyle={style}
                        style={{ borderWidth: 1, borderColor: "#e1e1e1" }}
                        onBegin={() => setScrollEnabled(false)}
                        onEnd={() => setScrollEnabled(true)}
                      />
                    </>
                  )}
                </View>
              </View>

              <View>{error != "" && <Text style={[newTaskStyles.textError]}>{error}</Text>}</View>
              {saving && <ActivityIndicator style={[newTaskStyles.loader]} size="large" color="#00ff00" />}

              <View style={[newTaskStyles.containerButtons]}>
                <TouchableOpacity style={[newTaskStyles.btnSave]} onPress={handleSave}>
                  <Entypo name="save" color="white" size={18} />
                  <Text style={[newTaskStyles.textBtnSave]}>Grabar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[newTaskStyles.btnSave]} onPress={() => handleSave(true)}>
                  <AntDesign name="sharealt" color="white" size={18} />
                  <Text style={[newTaskStyles.textBtnSave]}>Grabar y compartir</Text>
                </TouchableOpacity>
              </View>

              {isEditTask &&
                <View style={[newTaskStyles.containerButtons]}>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={[newTaskStyles.btnDelete]}>
                    <MaterialIcons name="cancel" size={18} color="white" />
                    <Text style={[newOrderStyles.textBtnOptions]}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDeleteTask()} style={[newTaskStyles.btnDelete]}>
                    <AntDesign name="delete" size={20} color="white" />
                    <Text style={[newOrderStyles.textBtnOptions]}>Eliminar tarea</Text>
                  </TouchableOpacity>
                </View>
              }

              <View>{show && <CDateTimePicker date={date} changeFunction={handleChangeDate} />}</View>
            </ScrollView>
          </View>
        }
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
  },
});
