import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
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

          const filteredLogInventory = logInventory[0]?.log
            ?.filter((entry) => entry.idItem === id)
            ?.map((item) => ({
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

          const filteredLogRestaurant = logRestaurant[0]?.log
            ?.filter((entry) => entry.idItem === id)
            ?.map((item) => ({
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
            ...(filteredLogInventory || []),
            ...(filteredLogRestaurant || []),
          ];

          console.log("combinedLogs: ", combinedLogs);

          const groupedData = combinedLogs.reduce((acc, curr) => {
            const { date, hour, ...rest } = curr;
            if (!acc[date]) {
              acc[date] = [];
            }

            acc[date].push({ hour, ...rest });

            return acc;
          }, {});

          Object.keys(groupedData).forEach((date) => {
            groupedData[date].sort((a, b) => {
              const [aHour, aMinute, aPeriod] = a.hour.split(/[:\s]/);
              const [bHour, bMinute, bPeriod] = b.hour.split(/[:\s]/);
              const aTime = ((aHour % 12) + (aPeriod.toLowerCase() === 'pm' ? 12 : 0)) * 60 + Number(aMinute);
              const bTime = ((bHour % 12) + (bPeriod.toLowerCase() === 'pm' ? 12 : 0)) * 60 + Number(bMinute);
              return aTime - bTime;
            });
          });

          console.log("groupedData: ", groupedData);

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
        <>
          <ActivityIndicator />
        </>;
      };
    }, [])
  );

  const renderHistoryItem = ({ item, index }) => {
    const date = Object.keys(item)[0];
    let internalIndex = 0;

    if (item[date]) {
      const reversedUpdates = [...item[date]].reverse();
      const knownKeys = [
        "delete",
        "enabled",
        "price",
        "purchaseCost",
        "servings",
        "quantity",
        "chooseBar",
        "image",
        "reset",
        "user",
        "hour",
      ];
      let otherChangesCount = 0;

      return (
        <>
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>{date}</Text>
          </View>
          {reversedUpdates.map((internalItem) => {
            const unknownChanges = Object.keys(internalItem).filter(
              (key) => !knownKeys.includes(key)
            ).length;
            otherChangesCount += unknownChanges;
            const knownChanges = Object.keys(internalItem).filter(
              (key) =>
                knownKeys.includes(key) && key !== "user" && key !== "hour"
            ).length;

            const changes = [];
            if (internalItem.chooseBar) {
              changes.push(`changed the bar to ${internalItem.chooseBar}`);
            }
            if (internalItem.quantity) {
              changes.push(`changed the quantity to ${internalItem.quantity}`);
            }
            if (internalItem.servings) {
              changes.push(`updated the servings to ${internalItem.servings}`);
            }
            if (internalItem.price) {
              changes.push(`updated the price to ${internalItem.price}`);
            }

            return (
              <View key={internalIndex++} style={styles.historyItem}>
                <Text style={styles.historyText}>{`${internalItem.user} ${
                  knownChanges > 0
                    ? internalItem.delete
                      ? `deleted item`
                      : changes.length !== 0
                      ? `has ${changes.join(" and ")}`
                      : internalItem.enabled
                      ? `disabled item`
                      : internalItem.price
                      ? `changed price to ${internalItem.price}`
                      : internalItem.purchaseCost
                      ? `changed the purchase cost  to ${internalItem.purchaseCost} usd`
                      : internalItem.image
                      ? `changed the product image `
                      : internalItem.reset
                      ? internalItem.reset
                      : `changed value in the product`
                    : `changed ${unknownChanges} values of the item`
                } at ${internalItem.hour}`}</Text>
                {unknownChanges > 0 && knownChanges > 0 && (
                  <Text
                    style={styles.historyText}
                  >{`Also changed ${unknownChanges} more values`}</Text>
                )}
              </View>
            );
          })}
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={data ? renderHistoryItem : <ActivityIndicator />}
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
