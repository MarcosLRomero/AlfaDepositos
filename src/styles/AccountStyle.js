import { StyleSheet } from "react-native";
import Colors from "./Colors";

const listAccountStyles = StyleSheet.create({
  loader: {
    padding: 30,
  },
  viewSearch: {
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  textSearch: {
    backgroundColor: Colors.WHITE,
    padding: 5,
    borderColor: Colors.GREY,
    borderRadius: 10,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 15,
    margin: 10,
  },
  btnNewAccount: {
    padding: 10,
    backgroundColor: Colors.DGREEN,
    marginBottom: 10
  },
  textBtnNewAccount: {
    color: Colors.WHITE,
    textAlign: "center",
    fontSize: 15
  }
});

const accountScreenStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  containerProfile: {},
  profile: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.GREY,
    paddingVertical: 10,
    marginVertical: 20,
  },
  textName: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
  textCode: {
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  btnCtaCte: {
    padding: 10,
    backgroundColor: Colors.DGREEN,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  textBtn: {
    color: Colors.WHITE,
    marginLeft: 10,
  },
});

const balanceStyles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  containerTitle: {
    textAlign: "center",
    marginVertical: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
  },
  titleName: {
    textAlign: "center",
    fontSize: 19,
  },
  image: {
    width: 60,
    height: 60,
  },
  btnShare: {
    padding: 10,
    backgroundColor: Colors.DBLUE,
    borderRadius: 5,
    flexDirection: "row",
  },
  textBtn: {
    color: Colors.WHITE,
    marginLeft: 10,
  },
});

const cAccountSearchStyles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.GREY,
    borderBottomWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export { listAccountStyles, accountScreenStyles, balanceStyles, cAccountSearchStyles };
