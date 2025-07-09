import { createStackNavigator } from "@react-navigation/stack";

import Login from "../screens/auth/Login";

const Stack = createStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
}
