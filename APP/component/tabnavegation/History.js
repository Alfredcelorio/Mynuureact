import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { getItemsByConditionGuest } from "../../services/conx/settings";

const generateMockHistory = () => {
  const groupedHistory = [];
  // Example dates
  const dates = ["2024-02-10", "2024-02-11", "2024-02-12"];
  dates.forEach((date, index) => {
    // Add date as a separate item
    groupedHistory.push({ id: `date-${date}`, date, isDate: true });
    // Add 3 logs per date
    for (let i = 0; i < 3; i++) {
      groupedHistory.push({
        id: `${date}-${i}`,
        user: `Alvaro Celorio`,
        action: i % 2 === 0 ? "added" : "updated",
        unit: i % 3 === 0 ? "servings" : "bottles",
        quantity: `${Math.floor(Math.random() * 10) + 1}`,
        time: `${Math.floor(Math.random() * 11) + 1}:${String(
          Math.floor(Math.random() * 59) + 10
        ).padStart(2, "0")} pm`,
        isDate: false,
      });
    }
  });
  return groupedHistory;
};

const SettingsScreen = ({ productData, id }) => {
  const history = generateMockHistory();
  const [data, setData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logInventory = await getItemsByConditionGuest(
          productData?.restaurantId,
          "logInventory",
          "idRestaurant"
        );

        const [originalLog] = logInventory;

        originalLog.log.forEach((item) => {
          item.time = new Date(item.time.seconds * 1000);
        });

        let groupedByDate = originalLog.log.reduce((acc, curr) => {
          let date = curr.time.toISOString().split("T")[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(curr);
          return acc;
        }, {});

        for (let date in groupedByDate) {
          let combinedNewData = [];
          groupedByDate[date].forEach((item) => {
            let time = item.time.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            combinedNewData.push({
              ...item.newData[0],
              user: item.user,
              hour: time,
            });
          });
          groupedByDate[date] = combinedNewData;
        }

        setData(groupedByDate);

        setSubmitLoading(false);
      } catch (err) {
        console.log("ERROR: ", err);
        setSubmitLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderHistoryItem = ({ item }) => {
    if (item.date) {
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>{item.date}</Text>
        </View>
      );
    }
    return (
      <View style={styles.historyItem}>
        <Text style={styles.historyText}>{`${item.user} add ${Object.keys(
          item
        )
          .filter((key) => key !== "user" && key !== "hour")
          .map((key) => `${key}: ${item[key]}`)
          .join(", ")} at ${item.hour}`}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={Object.entries(data).reduce((acc, [date, items]) => {
          acc.push({ date });
          acc.push(...items);
          return acc;
        }, [])}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
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

const test = {
  id: "dKWKHsJaZj3tE1XGbmji",
  idRestaurant: "uwZZZ0GtHxf5RiOpLt4oU2ZXjIX2",
  email: "biltd.88@gmail.com",
  idItem: "IFxovWzndNCZTOUwPGyi",
  nameItem: "Last test",
  log: [
    {
      time: " ",
      type: "new product in log - mobile",
      user: "Wilson Pernia",
      newData: [
        {
          chooseBar: "bar3",
        },
        {
          numbBottles: "8",
        },
      ],
    },
    {
      time: " ",
      type: "new product in log - mobile",
      user: "Wilson Pernia",
      newData: [
        {
          chooseBar: "bar3",
          numbBottles: "8",
        },
      ],
    },
    {
      time: " ",
      type: "new product in log - mobile",
      user: "Wilson Pernia",
      newData: [
        {
          chooseBar: "bar3",
        },
        {
          numbBottles: "8",
        },
        {
          chooseBar: "bar3",
        },
        {
          numbBottles: "8",
        },
      ],
    },
    {
      time: " ",
      type: "new product in log - mobile",
      user: "Wilson Pernia",
      newData: [
        {
          numbBottles: "8",
        },
      ],
    },
  ],
};
