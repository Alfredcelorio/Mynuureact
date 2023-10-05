import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScr from "../screens/LoginScr";
import FutureScreen from "../screens/FutureScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          initialParams={{ prop: 'test' }}
        />
        <Stack.Screen
          name="LoginScr"
          component={LoginScr}
          initialParams={{ prop: 'test' }}
        />
        <Stack.Screen
          name="FutureScreen"
          component={FutureScreen}
          initialParams={{ prop: 'test' }}
        />
      </Stack.Navigator>
  );
}
