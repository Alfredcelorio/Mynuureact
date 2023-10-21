import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { login } from '../config/api/auth';

export default function LoginScr({ navigation }) {

  const handleLogin = async () => {
    //const sendLogin = await login('Mynuutheapp@gmail.com', 'alvaro0220');
    //console.log('LOGIN: ', sendLogin)
     navigation.navigate('Mainmenu');
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
    fontFamily: 'Metropolis-SemiBold',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    letterSpacing: -0.25437501072883606,
    textAlign: 'left',
    color: '#fff',
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
