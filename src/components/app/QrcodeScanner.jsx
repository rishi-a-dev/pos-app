import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useEffect } from "react";
import { CameraView } from "expo-camera";
import Theme from "../../theme/Theme";
import { Close } from "../../assets/icons/Close";
import { Path, Svg } from "react-native-svg";

const QrcodeScanner = ({
  cameraVisible,
  setCameraVisible,
  onScan,
  isLandscape,
}) => {
  const scannedRef = useRef(false);
  const { height, width } = Dimensions.get("window");
  const maskRowHeight = Math.round((height - 300) / 20);
  const maskColWidth = (width - 300) / 2;

  useEffect(() => {
    if (cameraVisible) scannedRef.current = false;
  }, [cameraVisible]);

  const handleBarcodeScanned = ({ data }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    onScan?.(data);
  };

  return (
    cameraVisible && (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        <View style={styles.maskOutter}>
          <View
            style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
          />
          <View style={[{ flex: 30 }, styles.maskCenter]}>
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
            <View style={styles.maskInner} />
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
          </View>
          <View
            style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]}
          />
        </View>
        <View
          style={[
            styles.camera,
            {
              alignItems: "center",
              top: isLandscape ? "6%" : "20%",
              rowGap: 12,
            },
          ]}
        >
          <Text
            style={[
              Theme.typography.H1,
              { color: Theme.colors.text.secondary.default },
            ]}
          >
            Scan QR code
          </Text>
          <Text
            style={[
              Theme.typography.H4,
              { color: Theme.colors.text.secondary.muted },
            ]}
          >
            Scan your qr code to enter the app
          </Text>
        </View>
        <Svg
          width={353}
          height={353}
          viewBox="0 0 353 353"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute" }}
        >
          <Path
            d="M3 41v-8C3 16.431 16.431 3 33 3h8M3 312v8c0 16.569 13.431 30 30 30h8M350 41v-8c0-16.569-13.431-30-30-30h-8M350 312v8c0 16.569-13.431 30-30 30h-8"
            stroke="#fff"
            strokeWidth={6}
          />
        </Svg>
        <TouchableOpacity
          style={[styles.closeButton, { bottom: isLandscape ? "10%" : "25%" }]}
          onPress={() => setCameraVisible(false)}
        >
          <Close color="#FFF" />
        </TouchableOpacity>
      </View>
    )
  );
};

export default QrcodeScanner;

const styles = StyleSheet.create({
  cameraContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    alignSelf: "center",
    padding: 10,
    backgroundColor: Theme.colors.text.primary.disabled,
    borderRadius: 100,
  },
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  maskInner: {
    width: 300,
    backgroundColor: "transparent",
  },
  maskFrame: {
    backgroundColor: Theme.colors.background.secondary.muted,
    opacity: 0.9,
  },
  maskRow: {
    width: "100%",
  },
  maskCenter: { flexDirection: "row" },
});
