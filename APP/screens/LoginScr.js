import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScr({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log("Login pressed");
    console.log("Email:", email);
    console.log("Password:", password);
    // Perform login logic here
    navigation.navigate('Mainmenu');
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google pressed");
    // Perform Google login logic here
    // For example, you can integrate with Google Sign-In API
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Let's Rock and Roll!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#fff"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#fff"
        secureTextEntry={true} // Mask the input for passwords
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Log in with Google</Text>
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
    padding: 20,
  },
  welcomeText: {
    fontFamily: 'Metropolis-SemiBold',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    letterSpacing: -0.25437501072883606,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 40,
    backgroundColor: '#000', // Background color black
    borderColor: '#FFF', // Border color white
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#fff', // Font color white
  },
  loginButton: {
    width: '90%',
    padding: 15,
    backgroundColor: '#000',
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  googleButton: {
    width: '90%',
    padding: 15,
    backgroundColor: '#4285F4', // Google's brand color
    borderColor: '#4285F4',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
