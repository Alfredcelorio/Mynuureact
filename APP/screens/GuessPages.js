import React, { useState, useEffect, useContext } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  getItemsByConditionGuest,
  getItemsByConditionGuestAdmin,
} from "../services/auth/auth";
import { AuthContext } from "../context/context";

export default function GuestPages() {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await getItemsByConditionGuestAdmin(
            user?.uid,
            "guests",
            "restaurantId"
          );
          setData(data);
        } catch (error) {
          console.log("ERR: ", error);
        }
      };
      fetchData();
    }, [])
  );

  const formatDate = (date) => {
    return `${date?.getMonth() + 1}/${date?.getDate()}/${date?.getFullYear()}`;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    // console.log(selectedDate, date);
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(!show);
  };

  const navigation = useNavigation();

  const handleCancel = () => {};

  const filterDataByDate = (data, date) => {
    // console.log('DATA 1: ', data)
    // console.log('DATE 2: ', date)
    return data.filter((item) => {
      const lastVisitDate = new Date(
        item?.lastVisit?.seconds * 1000 + item?.lastVisit?.nanoseconds / 1000000
      );
      return lastVisitDate.toDateString() === date.toDateString();
    });
  };

  const renderItem = ({ item }) => {
    // lastVisit
    const lastVisitDate = new Date(
      item?.lastVisit?.seconds * 1000 + item?.lastVisit?.nanoseconds / 1000000
    );
    const formattedLastVisit = `${lastVisitDate?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    const lastVisit = `${
      lastVisitDate?.getMonth() + 1
    }/${lastVisitDate?.getDate()}/${lastVisitDate?.getFullYear()}`;

    // first visit
    const firstVisitDate = new Date(
      item.firstVisit?.seconds * 1000 + item.firstVisit?.nanoseconds / 1000000
    );
    const formattedFirstVisit = `${firstVisitDate?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    const firstVisit = `${firstVisitDate?.getMonth() + 1}
      /${firstVisitDate?.getDate()}/${firstVisitDate?.getFullYear()}`;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("GuestProfile", {
            guest: item,
            formattedLastVisit: lastVisit,
            formattedFirstVisit: firstVisit,
          });
        }}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.timeText}>{formattedLastVisit}</Text>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} onPress={showDatePicker}>
        {formatDate(date)}
      </Text>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          onCancel={handleCancel}
        />
      )}
      <FlatList
        data={filterDataByDate(data, date)}
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
    backgroundColor: "white", // Set the background color of the container
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 5, // Spacing on the sides of the list
  },
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec", // Light grey color for the item separator
  },
  timeText: {
    fontFamily: "Metropolis-Black",
    color: "black",
    fontWeight: "bold",
    marginRight: 10, // Space between time and name
  },
  nameText: {
    fontFamily: "Metropolis-Black",
    color: "black",
    fontWeight: "bold",
    marginRight: 10,
  },
  title: {
    fontFamily: "Metropolis-ExtraLight",
    color: "black",
    fontSize: 40, // Example size
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5, // Example spacing
    marginTop: 15,
  },
});
