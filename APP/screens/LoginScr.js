import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function LoginScr({ navigation }) {
  const handleGoogleLogin = () => {
    // Logic to handle Google login goes here
    console.log("Google login pressed");
  };

  const handleStartOver = () => {
    navigation.navigate('WelcomeScreen'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Lets Rock and Roll</Text>
      <TouchableOpacity style={styles.googleLoginButton} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Log in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.startOverButton} onPress={handleStartOver}>
        <Text style={styles.buttonText}>Start Over</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  welcomeText: {
    fontSize: 52,
    color: '#fff',
    fontWeight: 'bold',
  },
  googleLoginButton: {
    position: 'absolute',
    bottom: 50,    // Push it closer to the bottom
    left: '5%',   // Center it horizontally with 90% width
    width: '90%', // Set width to 90% of the screen
    padding: 15,
    backgroundColor: '#4285F4',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startOverButton: {
    position: 'absolute', // Position it absolutely
    bottom: 120,  // Position it just above the googleLoginButton
    left: '5%',  // Center it horizontally with 90% width
    width: '90%',
    padding: 15,
    backgroundColor: '#FF5733',
    borderRadius: 10,
    alignItems: "center",
  },

});
