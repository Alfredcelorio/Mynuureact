import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/brandicon.png')} style={styles.logo} />
      <Text style={styles.text}>Welcome Back!</Text>
      <Text style={styles.subtitleText}>the last menu you will ever need</Text>
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('FutureScreen')}>
        <Text style={styles.buttonText}>Next</Text>
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
    marginTop: 10,
  },
  logo: {
    marginTop: 180,
    width: 65.88,
    height: 48,
    resizeMode: 'contain',
  },
  nextButton: {
    position: 'absolute',
    bottom: '20%',  // Position it 20% from the bottom
    left: '5%',    // Center it horizontally with 90% width
    width: '90%',  // Set width to 90% of the screen
    padding: 15,
    backgroundColor: '#000',  // Black background
    borderColor: '#FFF',      // White border
    borderWidth: 1,           // Width of the border
    borderRadius: 10,
    alignItems: 'center',     // Center the text inside the button
},

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#F2F2F2', // This is the value of var(--greys-off-white, #F2F2F2)
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: -0.165,
    marginTop: 10, // Add some margin for spacing between the two texts
    opacity: 0.5
  }
});
