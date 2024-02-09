import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Switch, FlatList, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GuestProfile = () => {
  const [isVip, setIsVip] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [notes, setNotes] = useState([{ id: '1', date: '01/07/2023', content: 'likes coffee black' }]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [firstVisit, setFirstVisit] = useState('01/01/2022'); // Example date
  const [lastVisit, setLastVisit] = useState('12/31/2022'); // Example date


  const addNote = () => {
    const newNote = { id: String(notes.length + 1), date: new Date().toLocaleDateString(), content: newNoteContent };
    setNotes([...notes, newNote]);
    setNewNoteContent('');
    setIsModalVisible(false);
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <Text style={styles.noteDate}>{item.date}</Text>
      <Text style={styles.noteContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Alvaro Celorio</Text>
      </View>

      
      <View style={styles.infoContainer}>
        <Text style={styles.settingsTitle}>Contact</Text>
        <Text style={styles.infoText}>+13058046310</Text>
      </View>
      <View style={styles.visitInfoContainer}>
         <Text style={styles.visitInfoLabel}>First Visit:</Text>
         <Text style={styles.visitInfoValue}>{firstVisit}</Text>
        <Text style={styles.visitInfoLabel}>Last Visit:</Text>
        <Text style={styles.visitInfoValue}>{lastVisit}</Text>
        </View>
         <View style={styles.settings}>
          <Text style={styles.settingsTitle}>Settings</Text>
          <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>VIP</Text>
          <Switch
            value={isVip}
            onValueChange={() => setIsVip(previousState => !previousState)}
          />
        </View>
        <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Blacklist</Text>
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
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Icon name="plus" size={20} color="#FFF" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Enter Note"
              value={newNoteContent}
              onChangeText={setNewNoteContent}
            />
            <Button title="Add Note" onPress={addNote} />
            <Button title="Cancel" color="red" onPress={() => setIsModalVisible(false)} />
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: "Metropolis-Black",
    fontSize: 26,
    fontWeight: '300', // Lighter font weight for elegance
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'left',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  infoText: {
    fontFamily: "Metropolis-Light",
    fontWeight: '400',
    fontSize: 14,
    color: '#2F4858',
  },
  settings: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  settingText: {
    fontFamily: "Metropolis-Bold",
    fontSize: 14,
    color: '#333',
    fontWeight: '500', // Medium weight for readability
  },
  settingsTitle: {
    alignSelf: 'center',
    fontFamily: "Metropolis-Black",
    fontSize: 14,
    fontWeight: '600', // Semi-bold for clear section titles
    color: '#333',
    marginBottom: 15,
     // Optional: for a more modern look
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  notes: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  notesTitle: {
    alignSelf: 'center',
    fontFamily: "Metropolis-Black",
    fontSize: 14,
    fontWeight: '600', // Semi-bold for clear section titles
    color: '#333',
    marginBottom: 15,
    // Optional: for a more modern look
  },
  noteItem: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'black', // A muted gold for a touch of luxury
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    right: 30,
  },
  modalView: {
    margin: 20,
    marginTop: '50%', // Centered vertically
    backgroundColor: 'white', // A slight grey for a sleek look
    borderRadius: 10, // More subtle border radius
    padding: 25, // Slightly less padding for a sharper look
    alignItems: 'center',
    elevation: 10, // More pronounced shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalTextInput: {
    height: 40,
    width: '100%',
    borderColor: '#DADADA',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  visitInfoContainer: {
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 10,
    backgroundColor: '#FFFFFF', // Light background for contrast
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    alignItems: 'center', // Center items for a clean look
  },
  
  visitInfoLabel: {
    fontFamily: "Metropolis-Bold",
    fontSize: 16,
    color: '#333', // Dark color for the label for readability
  
  },
  
  visitInfoValue: {
    fontFamily: "Metropolis-Regular",
    fontSize: 14,
    color: '#666', // Slightly lighter color for the value to differentiate from the label
    marginLeft: 5,
    marginRight: 5,
  },
  
});
  

  

export default GuestProfile;
