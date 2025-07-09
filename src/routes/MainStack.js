import { createStackNavigator } from "@react-navigation/stack";

import { AuthStack } from "./AuthStack";
import { DrawerStack } from "./DrawerStack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export function MainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" component={AuthStack} />
        <Stack.Screen name="drawer" component={DrawerStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
