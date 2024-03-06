import React, { useState, useEffect, useContext } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getItemsByConditionGuest, getItemsByConditionGuestAdmin } from '../services/auth/auth';
import { AuthContext } from '../context/context';

// Sample data for guests
const guests = [
  { id: '1', name: 'Claudia Grinan', time: '6:45 PM' },
  { id: '2', name: 'Stephanie Razuri', time: '7:00 PM' },
  { id: '3', name: 'Sylvia Guerrero', time: '7:00 PM' },
  { id: '4', name: 'Fernando Boye', time: '7:15 PM' },
  { id: '5', name: 'Laura Patricia Tejada', time: '7:30 PM' },
  { id: '6', name: 'Juan Freire', time: '7:30 PM' },
  { id: '7', name: 'Emma Lopez', time: '7:45 PM' },
  { id: '8', name: 'Carlos Gutierrez', time: '7:45 PM' },
  { id: '9', name: 'Maria Gonzalez', time: '8:00 PM' },
  { id: '10', name: 'James Smith', time: '8:15 PM' },
  { id: '11', name: 'Patricia Brown', time: '8:30 PM' },
  { id: '12', name: 'Robert Davis', time: '8:30 PM' },
  { id: '13', name: 'Linda Martinez', time: '8:45 PM' },
  { id: '14', name: 'Michael Rodriguez', time: '9:00 PM' },
  { id: '15', name: 'Elizabeth Taylor', time: '9:15 PM' },
  { id: '16', name: 'David Anderson', time: '9:30 PM' },
  { id: '17', name: 'Jennifer Thomas', time: '9:45 PM' },
  { id: '18', name: 'Joseph Wilson', time: '10:00 PM' },
  { id: '19', name: 'Diana Moore', time: '10:15 PM' },
  { id: '20', name: 'John Jackson', time: '10:30 PM' },
  // ... add more guests as needed
];

export default function GuestPages() {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  console.log('DATA: ', data)

  const fetchData = async () => {
    try {
      const data = await getItemsByConditionGuestAdmin(
        user?.uid,
        "guests",
        "restaurantId"
      );
      setData(data);
    } catch (error) {
      console.log('ERR: ', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [show]);

  const formatDate = (date) => {
    return `${date?.getMonth() + 1}/${date?.getDate()}/${date?.getFullYear()}`;
  };

  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Hide picker only on iOS after selection
    console.log(selectedDate, date);
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(!show); // Toggle visibility of the picker
  };

  const navigation = useNavigation();

  const handleCancel = () => {

  }


  const renderItem = ({ item }) => {
    // lastVisit
    const lastVisitDate = new Date(
      item?.lastVisit?.seconds * 1000 + item?.lastVisit?.nanoseconds / 1000000
    );
    const formattedLastVisit = `${lastVisitDate?.toLocaleTimeString(
      'en-US',
      { hour: '2-digit', minute: '2-digit' }
    )}`;
    const lastVisit = `${
      lastVisitDate?.getMonth() + 1
    }/${lastVisitDate?.getDate()}/${lastVisitDate?.getFullYear()}`;

    // first visit
    const  firstVisitDate = new Date(
      item.firstVisit?.seconds * 1000 +
      item.firstVisit?.nanoseconds / 1000000
    );
    const  formattedFirstVisit = `${firstVisitDate?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    const firstVisit = `${
      firstVisitDate?.getMonth() + 1}
      /${firstVisitDate?.getDate()}/${firstVisitDate?.getFullYear()}`;

    return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('GuestProfile', { 
          guest: item,
          formattedLastVisit: lastVisit,
          formattedFirstVisit: firstVisit
        }); // Navigate to the GuestProfile screen with guestName as a parameter
      }}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.timeText}>{formattedLastVisit}</Text>
        <Text style={styles.nameText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  )
}
  

  return (
    <View style={styles.container}>
      <Text style={styles.title} onPress={showDatePicker}>
        {formatDate(date)} {/* Display the formatted date */}
      </Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default" // Correct display prop
          onChange={onChange}
          onCancel={handleCancel}
        />
      )}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Set the background color of the container
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 5, // Spacing on the sides of the list
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec', // Light grey color for the item separator
  },
  timeText: {
    fontFamily: "Metropolis-Black",
    color: "black",
    fontWeight: 'bold',
    marginRight: 10, // Space between time and name
  },
  nameText: {
    fontFamily: "Metropolis-Black",
    color: "black",
    fontWeight: 'bold',
    marginRight: 10, 
  },
  title: {
    fontFamily: "Metropolis-ExtraLight",
    color: "black",
    fontSize: 40, // Example size
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5, // Example spacing
    marginTop: 15,
  },
});
