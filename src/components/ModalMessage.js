import { ActivityIndicator, Alert, Modal, StyleSheet, Text, View } from "react-native";

export default function ModalMessage(props) {
  const styles = StyleSheet.create({
    loader: {
      padding: 30,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 40,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    containerButtons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      marginHorizontal: 10,
    },
    inputQty: {
      borderWidth: 1,
      borderColor: "#e1e1e1",
      padding: 10,
      width: 100,
      padding: 2,
      paddingHorizontal: 10,
    },
    inputQtyContainer: {
      padding: 10,
      width: "100%",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 20,
    },
  });

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          Alert.alert("Debe presionar cancelar.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.inputQtyContainer}>
              <Text style={styles.modalText}>{props.message}</Text>
              <ActivityIndicator style={styles.loader} size="large" color="#00ff00" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
