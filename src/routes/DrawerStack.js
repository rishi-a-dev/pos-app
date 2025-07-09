import { createDrawerNavigator } from "@react-navigation/drawer";

import Table from "../screens/Table";
import Dashboard from "../screens/Dashboard";
import EmployeeSelection from "../screens/EmployeeSelection";

const Drawer = createDrawerNavigator();

export function DrawerStack() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, swipeEnabled: false }}
    >
      <Drawer.Screen name="employeeselection" component={EmployeeSelection} />
      <Drawer.Screen name="table" component={Table} />
      <Drawer.Screen name="dashboard" component={Dashboard} />
    </Drawer.Navigator>
  );
}
