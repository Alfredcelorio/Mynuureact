import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeBaseProvider, Button, VStack, Text, Box, Select, CheckIcon, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

const InventoryScreen = () => {
  const [selectedBar, setSelectedBar] = useState('');
  const [selectedBottles, setSelectedBottles] = useState('');
  const [selectedServings, setSelectedServings] = useState('');

  // Example quantities for selection
  const quantityOptions = Array.from({ length: 20 }, (_, i) => `${i + 1}`);

  const handleUpdateInventory = () => {
    console.log(`Updating inventory for ${selectedBar}: ${selectedBottles} bottles, ${selectedServings} servings`);
    // Add logic to update the inventory, such as sending data to a backend server
  };

  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Box style={styles.header}>
            <Text style={styles.headerText}>Inventory Management</Text>
          </Box>
          <VStack space={5} alignItems="center" style={styles.formContainer}>
            <Select
              selectedValue={selectedBar}
              minWidth="90%"
              accessibilityLabel="Choose Bar"
              placeholder="Choose Bar"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={4} />,
              }}
              mt={1}
              onValueChange={(itemValue) => setSelectedBar(itemValue)}
            >
              <Select.Item label="Bar 1" value="bar1" />
              <Select.Item label="Bar 2" value="bar2" />
              <Select.Item label="Bar 3" value="bar3" />
            </Select>
            <Select
              selectedValue={selectedBottles}
              minWidth="90%"
              accessibilityLabel="Number of Bottles"
              placeholder="Number of Bottles"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={4} />,
              }}
              mt={1}
              onValueChange={(itemValue) => setSelectedBottles(itemValue)}
            >
              {quantityOptions.map((value) => (
                <Select.Item key={value} label={value} value={value} />
              ))}
            </Select>
            <Select
              selectedValue={selectedServings}
              minWidth="90%"
              accessibilityLabel="Number of Servings"
              placeholder="Number of Servings"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={4} />,
              }}
              mt={1}
              onValueChange={(itemValue) => setSelectedServings(itemValue)}
            >
              {quantityOptions.map((value) => (
                <Select.Item key={value} label={value} value={value} />
              ))}
            </Select>
            <Button
              size="lg"
              width="90%"
              onPress={handleUpdateInventory}
              backgroundColor="#222" // Button color
              leftIcon={<Icon as={MaterialIcons} name="update" size="sm" color="white" />}
              _text={{ color: 'white' }}
            >
              Update Inventory
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
    backgroundColor: 'white',
  },
  scrollView: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#222',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 10,
    width: '100%',
  },
});

export default InventoryScreen;
