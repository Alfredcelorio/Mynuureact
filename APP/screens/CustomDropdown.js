import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MenuScreen = ({ navigation }) => {
  const menus = ['Drink Menu', 'Wine List', 'Beers', 'Cocktails'];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>X</Text>
      </TouchableOpacity>
      {menus.map((menu, index) => (
        <Text key={index} style={styles.text}>
          {menu}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Black background
  },
  text: {
    fontSize: 36,
    marginBottom: 100,
    color: '#FFF', // White font color
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFF', // White font color for back button
  },
});

export default MenuScreen;
