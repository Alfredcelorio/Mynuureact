import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function FutureScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome to the future of restaurants</Text>
        <TouchableOpacity style={styles.thirdPageButton} onPress={() => navigation.navigate('LoginScr')}>
          <Text style={styles.buttonText}>Lets go!</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 52,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 50,
  },
  thirdPageButton: {
    position: 'absolute',
    bottom: '20%',  // Position it 20% from the bottom
    left: '5%',    // Center it horizontally with 90% width
    width: '90%',  // Set width to 90% of the screen
    padding: 15,
    backgroundColor: '#000',  // Black background
    borderColor: '#FFF',      // White border
    borderWidth: 1,           // Width of the border
    borderRadius: 10,
    alignItems: 'center', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
