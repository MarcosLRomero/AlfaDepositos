import { StyleSheet } from "react-native";
import Colors from "./Colors";

const listTasksStyles = StyleSheet.create({
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

const newTaskStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    marginTop: 20,
  },
  containerScroll: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  element: {
    marginVertical: 10,
  },
  label: {
    marginBottom: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.GREY,
    padding: 10,
  },
  textError: {
    fontSize: 16,
    color: Colors.ERROR,
    textAlign: "center",
  },
  textSuccess: {
    fontSize: 16,
    color: Colors.GREEN,
    textAlign: "center",
  },
  loader: {
    padding: 30,
  },
  loaderCentered: {
    padding: 30,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSave: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.DGREEN,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: "48%",
  },
  textBtnSave: {
    color: Colors.WHITE,
    marginLeft: 10,
  },
  containerButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnEdit: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.LBLUE,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  btnDelete: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.RED,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "48%",
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});

export { listTasksStyles, newTaskStyles };
