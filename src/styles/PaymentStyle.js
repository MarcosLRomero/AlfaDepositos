import { StyleSheet } from "react-native";
import Colors from "./Colors";

const localPaymentListStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  loader: {
    padding: 20,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  btnNewPayment: {
    padding: 10,
    backgroundColor: Colors.DGREEN,
    textAlign: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  textBtn: {
    color: Colors.WHITE,
    fontSize: 15,
  },
  containerDates: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    marginVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 14,
  },
});

const newPaymentStyles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 160,
  },
  containerScroll: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  element: {
    marginVertical: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 10,
    // marginTop: 10,
  },
  textError: {
    fontSize: 14,
    color: Colors.ERROR,
    textAlign: "center",
  },
  textSuccess: {
    fontSize: 16,
    color: Colors.DGREEN,
    textAlign: "center",
  },
  loader: {
    padding: 30,
  },
  containerButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnSave: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.DGREEN,
    // textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: "49%",
  },

  btnSaveWithEmail: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.DBLUE,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    width: "49%",
  },
  textBtnSave: {
    color: Colors.WHITE,
    marginLeft: 10,
  },
  btnNormal: {
    // flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.GREEN,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  textBtnNormal: {
    textAlign: "center",
    color: Colors.WHITE,
  },
  textPicker: {
    marginTop: 20,
  },
  containerPicker: {
    borderWidth: 2,
    borderColor: Colors.GREY,
  },
  picker: {
    width: "100%",
  },
  containerDates: {
    display: "none",
  },
  accordionHeader: {
    textAlign: "center",
    padding: 10,
    fontSize: 15,
    backgroundColor: Colors.DBLUE,
    color: Colors.WHITE,
  },
  addPaymentContainer: {
    borderColor: Colors.GREY,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    paddingBottom: 10,
  },
  titleCurrentMethods: {
    textAlign: "center",
    fontSize: 15,
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
    paddingBottom: 5,
    fontWeight: "bold",
    marginTop: 10,
  },
  itemListOfPayments: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: Colors.DGREY,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  btnDeleteCurrentPayment: {
    backgroundColor: Colors.RED,
    padding: 10,
  },
  textBtnDeleteCurrentPayment: {
    color: Colors.WHITE,
  },
  btnloadInvoices: {
    padding: 5,
    backgroundColor: Colors.DGREEN,
    marginVertical: 10,
  },
  textBtnloadInvoices: {
    color: Colors.WHITE,
    textAlign: "center",
  },
  itemListOfInvoices: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 5,
  },
  containerItemListOfInvoices: {
    borderBottomColor: Colors.DGREY,
    borderBottomWidth: 1,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    width: "98%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
  },
  headerBox: {
    flexGrow: 1,
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
});

const remotePaymentStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
  },
  loader: {
    padding: 20,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  btnSearchPayment: {
    padding: 10,
    backgroundColor: Colors.DBLUE,
    textAlign: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  textBtn: {
    color: Colors.WHITE,
  },
  containerDates: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "stretch",
    marginVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 10,
  },
});

const localItemPaymentStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  highContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "85%",
  },
  lowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    alignItems: "center",
  },
  price: {
    textAlign: "right",
  },
});

export { localPaymentListStyles, localItemPaymentStyles, newPaymentStyles, remotePaymentStyles };
