import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScr from "../screens/LoginScr";
import FutureScreen from "../screens/FutureScreen";
import Mainmenu from "../screens/Mainmenu"; // Importing the Mainmenu screen

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
    </Stack.Navigator>
  );
}
