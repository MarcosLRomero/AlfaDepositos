import { StyleSheet } from "react-native";
import Colors from "./Colors";
import { verticalScale, horizontalScale, moderateScale } from "../utils/Metrics"

const visitsScreenStyle = StyleSheet.create({
  loader: {
    padding: 30,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 15,
    margin: 10,
  },
  smallText: {
    textAlign: "center",
    fontSize: 12,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    padding: 10,
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
  },
});

const itemVisitStyle = StyleSheet.create({
  mainContainer: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
  },
  container: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnNewOrder: {
    backgroundColor: Colors.DGREEN,
    marginHorizontal: horizontalScale(50),
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  textBtnNewOrder: {
    color: Colors.WHITE,
    fontSize: moderateScale(13)
  },
  containerIconVisited: {},
  icon: {
    marginRight: 10,
    maxWidth: 50,
    // height: "auto",
  },
  infoContainer: {
    // paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  smallText: {
    fontSize: moderateScale(12),
  },
  mediumText: {
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  iconStatus: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  modalBody: {
    marginVertical: 100,
    marginHorizontal: 20,
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
  checkboxContainer: {
    flexDirection: "row",
    width: "100%",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  obsInput: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: Colors.GREY,
    borderWidth: 1,
    width: "100%",
    height: 150,
    marginVertical: 10,
  },
  buttonSave: {
    backgroundColor: Colors.DGREEN,
    padding: 10,
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: Colors.RED,
    padding: 10,
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  textButtonSave: {
    color: Colors.WHITE,
  },
  labelModal: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export { visitsScreenStyle, itemVisitStyle };
