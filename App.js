import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";

import { MainStack } from "./src/routes/MainStack";
import { FontLoader } from "./src/components/context/FontLoader";
import { OrientationProvider } from "./src/components/context/OrientationContext";
import { NetworkProvider } from "./src/components/context/NetworkContext";
import { Screen } from "./src/components/layout/Screen";
import { ToastProvider } from "./src/components/context/ToastContext";
import Toast from "./src/components/core/Toast";

const App = () => {
  return (
    <FontLoader>
      <ToastProvider>
        <NetworkProvider>
          <OrientationProvider>
            <Screen>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <PortalProvider>
                  <MainStack />
                  <Toast />
                </PortalProvider>
              </GestureHandlerRootView>
            </Screen>
          </OrientationProvider>
        </NetworkProvider>
      </ToastProvider>
    </FontLoader>
  );
};

export default App;
