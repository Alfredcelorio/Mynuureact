import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function LoginScr({ navigation }) {

  const handleLogin = () => {
    console.log("Login pressed");
    // Add your login logic here if needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Lets Rock and Roll!</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
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
  loginButton: {
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
  },
  startOverButton: {
    position: 'absolute', // Position it absolutely
    bottom: 120,  // Position it just above the loginButton
    left: '5%',  // Center it horizontally with 90% width
    width: '90%',
    padding: 15,
    backgroundColor: '#FF5733',
    borderRadius: 10,
    alignItems: "center",
  },
});
