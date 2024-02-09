import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/context";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScr from "../screens/LoginScr";
import FutureScreen from "../screens/FutureScreen";
import Mainmenu from "../screens/Mainmenu";
import BarDashboard from "../screens/BarDashboard";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CustomDropdown from "../screens/CustomDropdown";
import Noimagesmenu from "../screens/Noimagesmenu";
import GuestProfile from "../screens/GuestProfile";
import GeneralSettingsScreen from "../screens/GeneralSettingsScreen";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, StyleSheet } from "react-native";
import DrawerNavigator from "../component/DrawerNavigator";
import Header from "../component/Header";

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
        name="LoginScr"
        component={currentUser ? DrawerNavigator : LoginScr}
        options={{
          headerShown: false,
          drawerLabel: "LoginScr",
          drawerIcon: () => (
            <MaterialCommunityIcons name="logout" size={20} color="#808080" />
          ),
        }}
      />
      <Stack.Screen
        name="GuestPages"
        component={currentUser ? DrawerNavigator : LoginScr}
        options={{
          headerShown: false,
          drawerLabel: "GuestPages",
          drawerIcon: () => (
            <MaterialCommunityIcons name="home" size={20} color="#808080" />
          ),
        }}
      />
      <Stack.Screen
        name="BarDashboard"
        component={currentUser ? DrawerNavigator : LoginScr}
        options={{
          headerShown: false,
          drawerLabel: "BarDashboard",
          drawerIcon: () => (
            <MaterialCommunityIcons name="home" size={20} color="#808080" />
          ),
        }}
      />
      <Stack.Screen
        name="item"
        component={currentUser ? ProductDetailScreen : LoginScr}
        options={{ header: () => <Header/> }}
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
       name="GuestProfile"
       component={GuestProfile}
       options={{
       headerShown: true, // You can configure the header as needed
       title: "Guest Profile", // Set the title for the screen
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

const styles = StyleSheet.create({
  menuIcon: {
    position: "absolute",
    top: Platform.OS === "ios" ? 44 : 45,
    left: 10,
    zIndex: 100,
  },
});
