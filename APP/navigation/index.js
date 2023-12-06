import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScr from "../screens/LoginScr";
import FutureScreen from "../screens/FutureScreen";
import Mainmenu from "../screens/Mainmenu";
import ProductDetailScreen from '../screens/ProductDetailScreen'; 
import CustomDropdown from "../screens/CustomDropdown";
import Noimagesmenu from  "../screens/Noimagesmenu";
import GeneralSettingsScreen from '../screens/GeneralSettingsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="WelcomeScreen">
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          title: 'Welcome',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="LoginScr"
        component={LoginScr}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="FutureScreen"
        component={FutureScreen}
        options={{
          title: 'Future',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Mainmenu"
        component={Mainmenu}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen  
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: false
        }}
      />
       <Stack.Screen  
        name="CustomDropdown"
        component={CustomDropdown}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen  
  name="Noimagesmenu" // Use the same name as in your import if you plan to navigate to this screen.
  component={Noimagesmenu} // The corrected component reference
  options={{
    headerShown: false
  }}
/>    
<Stack.Screen
  name="GeneralSettings"
  component={GeneralSettingsScreen}
  options={{
    headerShown: true,
    title: 'General Settings',
    // Add other options as needed
  }}
/> 

    </Stack.Navigator>
  );
}
