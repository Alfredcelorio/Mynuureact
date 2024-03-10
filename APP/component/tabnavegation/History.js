import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { getItemsByConditionGuest } from "../../services/conx/settings";
import { useFocusEffect } from "@react-navigation/native";

const SettingsScreen = ({ productData, id }) => {
  const [data, setData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Add this line

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setRefreshing(true);
  
          const logInventory = await getItemsByConditionGuest(
            productData?.restaurantId,
            "logInventory",
            "idRestaurant"
          );
  
          const logRestaurant = await getItemsByConditionGuest(
            productData?.restaurantId,
            "log",
            "idRestaurant"
          );
  
          const filteredLogInventory = logInventory[0].log
            .filter((entry) => entry.idItem === id)
            .map((item) => ({
              ...item.newData[0],
              user: item.user,
              hour: new Date(item.time.seconds * 1000).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              ),
              date: new Date(item.time.seconds * 1000)
                .toISOString()
                .split("T")[0],
            }));
  
          const filteredLogRestaurant = logRestaurant[0].log
            .filter((entry) => entry.idItem === id)
            .map((item) => ({
              ...item.edit,
              user: item.user,
              hour: new Date(item.time.seconds * 1000).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }
              ),
              date: new Date(item.time.seconds * 1000)
                .toISOString()
                .split("T")[0],
            }));
  
          const combinedLogs = [
            ...filteredLogInventory,
            ...filteredLogRestaurant,
          ];
  
          const groupedData = combinedLogs.reduce((acc, curr) => {
            const { date, hour, ...rest } = curr;
            if (!acc[date]) {
              acc[date] = [];
            }
  
            let found = false;
            acc[date].forEach((obj) => {
              if (obj.hour === hour) {
                Object.assign(obj, rest);
                found = true;
              }
            });
  
            if (!found) {
              acc[date].push({ hour, ...rest });
            }
  
            return acc;
          }, {});
  
          const formattedData = Object.entries(groupedData).map(
            ([date, changes]) => ({
              [date]: changes,
            })
          );
  
          const sortedData = formattedData.sort((a, b) => {
            const dateA = Object.keys(a)[0];
            const dateB = Object.keys(b)[0];
            return new Date(dateB) - new Date(dateA);
          });
  
          setData(sortedData);
          setSubmitLoading(false);
        } catch (err) {
          console.log("ERROR: ", err);
          setSubmitLoading(false);
        }
      };
  
      fetchData();

      return () => {
        <><ActivityIndicator/></>
      };
    }, [])
  );

  const renderHistoryItem = ({ item, index }) => {
    const date = Object.keys(item)[0];
    let internalIndex = 0;
  
    if (item[date]) {

      const reversedUpdates = [...item[date]].reverse();
    
      return (
        <>
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>{date}</Text>
          </View>
          {reversedUpdates.map((internalItem) => {
            return (
              <View key={internalIndex++} style={styles.historyItem}>
                <Text style={styles.historyText}>{`${internalItem.user} ${
                  internalItem.delete
                    ? `deleted item`
                    : internalItem.enabled
                    ? `disabled item`
                    : internalItem.price
                    ? `changed price to ${internalItem.price}`
                    : internalItem.purchaseCost
                    ? `changed the purchase cost  to ${internalItem.purchaseCost} usd`
                    : internalItem.servings
                    ? `updated the amount servings to ${internalItem.servings}`
                    : internalItem.quantity
                    ? `changed the amount of bottles  to ${internalItem.quantity}`
                    : internalItem.chooseBar
                    ? `updated the bar to  ${internalItem.chooseBar}`
                    : internalItem.image
                    ? `changed the product image `
                    : `changed value in the product`
                } at ${internalItem.hour}`}</Text>
              </View>
            );
          })}
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={
          data ? renderHistoryItem : <ActivityIndicator />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
        ListFooterComponent={submitLoading ? <ActivityIndicator /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    padding: 20,
  },
  historyItem: {
    backgroundColor: "black",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  historyText: {
    color: "#fff",
  },
  dateHeader: {
    paddingVertical: 8,
    backgroundColor: "black", // Slightly different background for date headers
    borderRadius: 5,
    marginTop: 10,
  },
  dateHeaderText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default SettingsScreen;
