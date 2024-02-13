import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeBaseProvider, Button, VStack, Text, Box, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const InventoryScreen = () => {
  const handleInventorizeAI = () => {
    console.log('Inventorize with AI');
  };

  const handleInventorizeManually = () => {
    console.log('Inventorize Manually');
  };

  const handleInventorizeBarcode = () => {
    console.log('Inventorize Manually with Barcode');
  };

  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>
        <Box style={styles.header}>
          <Text style={styles.headerText}>Inventory Management</Text>
        </Box>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <VStack space={5} alignItems="center" style={styles.buttonContainer}>
            <Button
              size="lg"
              width="90%"
              onPress={handleInventorizeAI}
              backgroundColor="#222" // Green
              leftIcon={<Icon as={MaterialIcons} name="cloud" size="sm" color="white" />}
              _text={{ color: 'white' }}
              accessibilityLabel="Inventorize with AI">
              Inventorize with AI (New)
            </Button>
            <Button
              size="lg"
              width="90%"
              onPress={handleInventorizeManually}
              backgroundColor="#222" // Blue
              leftIcon={<Icon as={MaterialIcons} name="handyman" size="sm" color="white" />}
              _text={{ color: 'white' }}
              accessibilityLabel="Inventorize Manually">
              Inventorize Manually
            </Button>
            <Button
              size="lg"
              width="90%"
              onPress={handleInventorizeBarcode}
              backgroundColor="#222" // Red
              leftIcon={<Icon as={MaterialIcons} name="qr-code-scanner" size="sm" color="white" />}
              _text={{ color: 'white' }}
              accessibilityLabel="Inventorize with Barcode">
              Inventorize with Barcode
            </Button>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Light background
  },
  scrollView: {
    alignItems: 'center',
    paddingVertical: 20, // Padding for the ScrollView
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#222', // Dark header background
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10, // Adjusted for spacing from the header
    width: '100%', // Ensure the VStack takes up full container width
  },
});

export default InventoryScreen;
