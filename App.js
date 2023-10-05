import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Updated paths to point to the 'screens' folder
//OAuth client created for ios, android and web
//web 286050939937-mr6d95mcbsop05lii7qk3jve2ldjs4fg.apps.googleusercontent.com
//ios 286050939937-8euod7ujq8uq1ktqb4pmdjd5hbhsek41.apps.googleusercontent.com
//android 286050939937-d79lhlsek38tr84id25e4v2rqplpvn9o.apps.googleusercontent.com

import WelcomeScreen from './screens/WelcomeScreen';
import FutureScreen from './screens/FutureScreen';
import LoginScreen from './screens/LoginScr';  // Import the new screen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" headerMode="none">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Future" component={FutureScreen} />
        <Stack.Screen name="Login" component={LoginScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
