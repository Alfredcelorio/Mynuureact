// GeneralSettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GeneralSettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>General Settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GeneralSettingsScreen;
