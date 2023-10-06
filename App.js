import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './APP/navigation/index';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}