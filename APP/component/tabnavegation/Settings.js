import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';

const SettingsScreen = () => {
  const [availability, setAvailability] = useState(false);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [purchaseCost, setPurchaseCost] = useState(''); // Assuming this is what you meant by the second price input
  const [abv, setAbv] = useState('');
  const [body, setBody] = useState('');
  const [brand, setBrand] = useState('');
  const [countryState, setCountryState] = useState('');
  const [region, setRegion] = useState('');
  const [sku, setSku] = useState('');
  const [taste, setTaste] = useState('');
  const [type, setType] = useState('');
  const [varietal, setVarietal] = useState('');
  const [servings, setServings] = useState('');

  const saveSettings = () => {
    // Implement your save logic here
    console.log('Saving settings...');
    // For example, you could post these settings to a server, or save them locally
  };

  const changeImage = () => {
    // Implement your logic for changing the image here
    console.log('Change image logic goes here');
    // For example, set a new image URL or open an image picker
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity onPress={saveSettings} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Item Name</Text>
          <TextInput
            style={styles.settingInput}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Enter item name"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Price</Text>
          <TextInput
            style={styles.settingInput}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Purchase Cost</Text>
          <TextInput
            style={styles.settingInput}
            value={purchaseCost}
            onChangeText={setPurchaseCost}
            placeholder="Enter purchase cost"
            keyboardType="numeric"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Servings</Text>
          <TextInput
            style={styles.settingInput}
            value={servings}
            onChangeText={setServings}
            placeholder="Servings"
            keyboardType="numeric"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>ABV</Text>
          <TextInput
            style={styles.settingInput}
            value={abv}
            onChangeText={setAbv}
            placeholder="ABV"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Body</Text>
          <TextInput
            style={styles.settingInput}
            value={body}
            onChangeText={setBody}
            placeholder="Body"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Brand</Text>
          <TextInput
            style={styles.settingInput}
            value={brand}
            onChangeText={setBrand}
            placeholder="Brand"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Country/State</Text>
          <TextInput
            style={styles.settingInput}
            value={countryState}
            onChangeText={setCountryState}
            placeholder="Country/State"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Region</Text>
          <TextInput
            style={styles.settingInput}
            value={region}
            onChangeText={setRegion}
            placeholder="Region"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>SKU</Text>
          <TextInput
            style={styles.settingInput}
            value={sku}
            onChangeText={setSku}
            placeholder="SKU"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Taste</Text>
          <TextInput
            style={styles.settingInput}
            value={taste}
            onChangeText={setTaste}
            placeholder="Taste"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Type</Text>
          <TextInput
            style={styles.settingInput}
            value={type}
            onChangeText={setType}
            placeholder="Type"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Varietal</Text>
          <TextInput
            style={styles.settingInput}
            value={varietal}
            onChangeText={setVarietal}
            placeholder="Varietal"
            placeholderTextColor="#ccc"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Availability</Text>
          <Switch
            value={availability}
            onValueChange={setAvailability}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={availability ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
        <TouchableOpacity onPress={changeImage} style={styles.changeImageButton}>
          <Text style={styles.changeImageButtonText}>Change Image</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
  },
  settingLabel: {
    fontSize: 18,
    color: '#fff',
  },
  settingInput: {
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    flex: 1,
    marginRight: 10,
    textAlign: 'right',
    placeholderTextColor: '#ccc', // Ensures placeholder text is also visible
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'black', // Match your theme
  },
  saveButton: {
    backgroundColor: 'black', // A green color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  changeImageButton: {
    backgroundColor: 'blue', // Or any color that fits your design
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center', // Center the text inside the button
    marginTop: 20, // Add some margin at the top
  },
  changeImageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SettingsScreen;
