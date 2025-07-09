import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import Theme from "../../theme/Theme";

export const PrinterStatus = ({
  isModalVisible,
  toggleModal,
  printStatus,
  connectionMessage,
  errorMessage,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <LottieView
            autoPlay
            loop={false}
            style={styles.lottieAnimation}
            speed={1.5}
            source={
              printStatus === "success"
                ? require("../../assets/anim/Success.json")
                : require("../../assets/anim/Failed.json")
            }
            onAnimationFinish={() => {
              toggleModal(null);
            }}
          />
          <Text style={styles.printerConnectionMsg}>{connectionMessage}</Text>
          <Text style={styles.printerErrorMsg}>{errorMessage}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  printerConnectionMsg: {
    paddingTop: 40,
    fontSize: Theme.typography.fontSize[16],
    fontFamily: "Montserrat-SemiBold",
  },
  printerErrorMsg: {
    fontSize: Theme.typography.fontSize[10],
    fontFamily: "Montserrat-Medium",
    color: Theme.colors.text.accents.red,
  },
});
