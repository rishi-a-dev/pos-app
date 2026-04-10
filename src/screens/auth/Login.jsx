import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useCameraPermissions } from "expo-camera";
import { useSharedValue } from "react-native-reanimated";

import Theme from "../../theme/Theme";
import { useOrientation } from "../../components/context/OrientationContext";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "../../components/context/ToastContext";
import { useFetchData } from "../../components/hooks/useFetchData";
import { useAppStore } from "../../stores";
import QrcodeScanner from "../../components/app/QrcodeScanner";
import { ResetConfirm } from "../../components/app/ResetConfirm";

const APP_VERSION = require("../../../package.json").version;

const Login = () => {
  const [cameraVisible, setCameraVisible] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const isLandscape = useOrientation();
  const navigation = useNavigation();
  const { showToast } = useToast();
  const { fetchData } = useFetchData();
  const dbData = useAppStore((state) => state.dbData);
  const reset = useAppStore((state) => state.resetStore);
  const setDbData = useAppStore((state) => state.setDbData);
  const isOpen = useSharedValue(false);
  const [permission, requestPermission] = useCameraPermissions();

  const toggleSheet = () => {
    Keyboard.dismiss();
    isOpen.value = !isOpen.value;
  };

  const onConfirm = () => {
    reset();
    setUsername("");
    setPassword("");
    toggleSheet();
  };

  React.useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  React.useEffect(() => {
    if (dbData && dbData.username) {
      setUsername(dbData.username);
    }
  }, [dbData]);

  const fetchQRData = async (qrCodeValue) => {
    const respData = await fetchData(
      `auth/Qreader?qrcode=${encodeURIComponent(qrCodeValue)}`,
    );
    if (respData) {
      setDbData({
        ...dbData,
        skey: respData.sKey,
        apilink: respData.apilink,
        branchData: respData.branchData,
        companyData: respData.companyData,
      });
      showToast({
        type: "success",
        message: respData.message || "Connection successfull",
        duration: 3000,
      });
    }
  };

  const handleQrButtonPress = () => {
    if (permission?.granted) {
      setCameraVisible(true);
    } else if (permission && !permission.canAskAgain) {
      showToast({ message: "Camera permission is required" });
    } else {
      requestPermission().then(({ granted }) => {
        if (granted) setCameraVisible(true);
        else showToast({ message: "Camera permission is required" });
      });
    }
  };

  const handleQrScanned = (data) => {
    fetchQRData(data);
    setCameraVisible(false);
  };

  const handleLogin = async () => {
    if (isLoggingIn) return; // prevent double-tap / repeated requests
    setIsLoggingIn(true);

    const body = {
      username: username,
      password: password,
      branch: dbData.branchData,
      company: dbData.companyData,
    };
    try {
      const data = await fetchData(`auth/login`, "post", body);
      if (data?.token) {
        setDbData({
          ...dbData,
          token: data.token,
          adminname: data.users.firstName,
          username: username,
        });
        setUsername("");
        setPassword("");
        navigation.navigate("drawer", { screen: "employeeselection" });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.background}>
        {dbData && (
          <TouchableOpacity
            style={[
              styles.qrButton,
              {
                alignSelf: "flex-end",
                marginTop: 24,
                marginRight: "3%",
                paddingHorizontal: isLandscape ? "1%" : "2%",
                paddingVertical: isLandscape ? "0.5%" : "1%",
              },
            ]}
            onPress={toggleSheet}
          >
            <Text style={styles.qrText}>Reset App</Text>
          </TouchableOpacity>
        )}
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {dbData ? (
            <View
              style={[
                styles.innerContainer,
                { width: isLandscape ? "50%" : "75%" },
              ]}
            >
              <Text style={styles.header}>LOGIN</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                style={[styles.button, isLoggingIn && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={isLoggingIn}
              >
                <Text style={styles.buttonText}>
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.buttonText}>Scan QR Code to continue</Text>
              <TouchableOpacity
                style={[
                  styles.qrButton,
                  {
                    alignSelf: "center",
                    marginTop: isLandscape ? "8%" : "12%",
                    paddingHorizontal: isLandscape ? "1%" : "2%",
                    paddingVertical: isLandscape ? "0.5%" : "1%",
                  },
                ]}
                onPress={handleQrButtonPress}
              >
                <Text style={styles.qrText}>Scan QR code</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
        <QrcodeScanner
          isLandscape={isLandscape}
          cameraVisible={cameraVisible}
          onScan={handleQrScanned}
          setCameraVisible={setCameraVisible}
        />
        <ResetConfirm
          isOpen={isOpen}
          toggleSheet={toggleSheet}
          onConfirm={onConfirm}
        />
        <Text style={styles.versionText}>{`Version ${APP_VERSION}`}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Theme.colors.background.secondary.muted,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    backgroundColor: Theme.colors.text.primary.default,
    padding: "2%",
    alignItems: "center",
    borderRadius: Theme.border.radius.medium,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.text.secondary.muted,
  },
  header: {
    width: "100%",
    ...Theme.typography.H1,
    textAlign: "center",
    color: Theme.colors.text.secondary.default,
    borderBottomWidth: Theme.border.width.normal,
    borderBottomColor: Theme.colors.text.secondary.muted,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: "4%",
  },
  inputLabel: {
    width: "auto",
    ...Theme.typography.H2,
    color: Theme.colors.text.secondary.default,
  },
  input: {
    flex: 1,
    ...Theme.typography.H3,
    color: Theme.colors.text.secondary.default,
    padding: 4,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.text.secondary.muted,
    marginLeft: "2%",
  },
  button: {
    width: "100%",
    paddingVertical: "2%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.background.primary.default,
  },
  buttonText: {
    width: "100%",
    textAlign: "center",
    ...Theme.typography.H1,
    color: Theme.colors.text.secondary.default,
  },
  qrButton: {
    borderRadius: 40,
    borderWidth: Theme.border.width.normal,
    borderColor: Theme.colors.text.secondary.default,
    backgroundColor: Theme.colors.background.secondary.muted,
    elevation: 12,
  },
  qrText: {
    ...Theme.typography.H3,
    color: Theme.colors.text.secondary.default,
  },
  versionText: {
    alignSelf: "center",
    marginBottom: "4%",
    ...Theme.typography.H4,
    color: Theme.colors.text.secondary.muted,
  },
});
