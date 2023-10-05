import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function FutureScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to the future of restaurants</Text>
        <TouchableOpacity style={styles.thirdPageButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Go to Third Page</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 52,
    color: '#fff',
    fontWeight: 'bold',
  },
  thirdPageButton: {
    position: 'absolute',
    bottom: '20%',  // Position it 20% from the bottom
    left: '5%',    // Center it horizontally with 90% width
    width: '90%',  // Set width to 90% of the screen
    padding: 15,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  }
});
