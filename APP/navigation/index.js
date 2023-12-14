import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from '../context/context';
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScr from "../screens/LoginScr";
import FutureScreen from "../screens/FutureScreen";
import Mainmenu from "../screens/Mainmenu";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CustomDropdown from "../screens/CustomDropdown";
import Noimagesmenu from "../screens/Noimagesmenu";
import GeneralSettingsScreen from "../screens/GeneralSettingsScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { currentUser } = useContext(AuthContext);
  return (
    <Stack.Navigator initialRouteName="WelcomeScreen">
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          title: "Welcome",
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="LoginScr"
        component={currentUser ? Mainmenu : LoginScr}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FutureScreen"
        component={FutureScreen}
        options={{
          title: "Future",
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Mainmenu"
        component={currentUser ? Mainmenu : LoginScr}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={currentUser ? ProductDetailScreen : LoginScr}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CustomDropdown"
        component={currentUser ? CustomDropdown : LoginScr}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Noimagesmenu" // Use the same name as in your import if you plan to navigate to this screen.
        component={currentUser ? Noimagesmenu : LoginScr} // The corrected component reference
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GeneralSettings"
        component={GeneralSettingsScreen}
        options={{
          headerShown: true,
          title: "General Settings",
          // Add other options as needed
        }}
      />
    </Stack.Navigator>
  );
}
