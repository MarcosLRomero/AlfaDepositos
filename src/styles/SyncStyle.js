import { StyleSheet } from "react-native";
import Colors from "./Colors";
import { moderateScale, horizontalScale, verticalScale } from "../utils/Metrics";

const syncStyle = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: moderateScale(16),
    textAlign: "center",
    padding: 10,
    marginVertical: verticalScale(20)
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: verticalScale(20),
  },
  btnSync: {
    padding: 15,
    backgroundColor: Colors.DGREEN,
  },
  textBtnSync: {
    fontSize: moderateScale(17),
    color: Colors.WHITE,
  },
  errorMessage: {
    fontSize: moderateScale(15),
    color: Colors.ERROR,
    padding: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  finalText: {
    fontSize: moderateScale(15),
    marginTop: verticalScale(20),
  },
  btnReturn: {
    padding: 5,
    backgroundColor: Colors.DGREEN,
  },
  textBtnReturn: {
    fontSize: moderateScale(16),
    textAlign: "center",
    color: Colors.WHITE,
  },
});

const sendPending = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    marginTop: 10,
    padding: 10,
  },
  textHeader: {
    fontSize: 16,
    textAlign: "center",
  },
  imageHeader: {
    marginVertical: 20,
    width: 70,
    height: 70,
  },
  btnSendPending: {
    padding: 10,
    marginVertical: 20,
    backgroundColor: Colors.DGREEN,
  },
  btnSendPendingDisabled: {
    opacity: 0.6,
  },
  textBtnSendPending: {
    color: Colors.WHITE,
    fontSize: 17,
  },
  containerTextError: {
    marginVertical: 20,
  },
  textError: {
    color: Colors.ERROR,
    fontSize: 16,
    margin: 10,
    textAlign: "center",
  },
});

const cSyncItemStyles = StyleSheet.create({
  syncText: {
    fontSize: 15,
    paddingBottom: 5,
  },
  loaderContainer: {
    marginLeft: 20,
    width: 140,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  loader: {
    marginRight: 10,
  },
  syncOkIcon: {
    alignSelf: "center",
    marginRight: 10,
    width: 20,
    height: 20,
  },
});

export { syncStyle, sendPending, cSyncItemStyles };
