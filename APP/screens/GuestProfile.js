import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Switch, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package

const GuestProfile = () => {
  // State for the toggle switch
  const [isVip, setIsVip] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);

  // Sample data for notes, you can replace it with real data
  const notes = [
    { id: '1', date: '12/04/2023', content: 'likes coffee black' },
    // ... more notes
  ];

  // Function to render each note in the list
  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteDate}>{item.date}</Text>
      <Text style={styles.noteContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{ uri: 'path-to-your-image' }} // Replace with your image path
        />
        <Text style={styles.name}>Alvaro Celorio</Text>
        <Text style={styles.phone}>+13058046310</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Icon name="account-box-outline" size={24} color="#FFF" />
        <Text style={styles.infoText}>Contact</Text>
        <Text style={styles.infoText}>+13058046310</Text>
      </View>
      
      {/* ... other info containers ... */}

      <View style={styles.settings}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>VIP</Text>
          <Switch
            value={isVip}
            onValueChange={() => setIsVip(previousState => !previousState)}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Blacklist</Text>
          <Switch
            value={isBlacklisted}
            onValueChange={() => setIsBlacklisted(previousState => !previousState)}
          />
        </View>
      </View>

      <View style={styles.notes}>
        <Text style={styles.notesTitle}>Notes</Text>
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
        />
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Add styles for GuestProfile here
const styles = StyleSheet.create({
  // Define your styles for the container, header, avatar, name, phone, infoContainer, settings, notes, etc.
  // Make sure to set the colors, fonts, and layout as per your screenshot
});

export default GuestProfile;
