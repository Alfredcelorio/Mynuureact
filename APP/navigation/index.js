import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ScreenOne from "../routeTest/screenOne";
import ScreenTwo from "../routeTest/screenTwo";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator initialRouteName="ScreenTwo">
        <Stack.Screen
          name="ScreenOne"
          component={ScreenOne}
          initialParams={{ prop: 'test' }}
        />
        <Stack.Screen
          name="ScreenTwo"
          component={ScreenTwo}
          initialParams={{ prop: 'test' }}
        />
      </Stack.Navigator>
  );
}
