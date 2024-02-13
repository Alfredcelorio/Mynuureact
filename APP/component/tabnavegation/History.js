import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

const generateMockHistory = () => {
  const groupedHistory = [];
  // Example dates
  const dates = ['2024-02-10', '2024-02-11', '2024-02-12'];
  dates.forEach((date, index) => {
    // Add date as a separate item
    groupedHistory.push({ id: `date-${date}`, date, isDate: true });
    // Add 3 logs per date
    for (let i = 0; i < 3; i++) {
      groupedHistory.push({
        id: `${date}-${i}`,
        user: `Alvaro Celorio`,
        action: i % 2 === 0 ? 'added' : 'updated',
        unit: i % 3 === 0 ? 'servings' : 'bottles',
        quantity: `${Math.floor(Math.random() * 10) + 1}`,
        time: `${Math.floor(Math.random() * 11) + 1}:${String(Math.floor(Math.random() * 59) + 10).padStart(2, '0')} pm`,
        isDate: false,
      });
    }
  });
  return groupedHistory;
};

const SettingsScreen = () => {
  const history = generateMockHistory();

  const renderHistoryItem = ({ item }) => {
    if (item.isDate) {
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>{item.date}</Text>
        </View>
      );
    }
    return (
      <View style={styles.historyItem}>
        <Text style={styles.historyText}>{`${item.user} ${item.action} ${item.quantity} ${item.unit} at ${item.time}`}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContainer}
      />
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
  historyItem: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  historyText: {
    color: '#fff',
  },
  dateHeader: {
    paddingVertical: 8,
    backgroundColor: 'black', // Slightly different background for date headers
    borderRadius: 5,
    marginTop: 10,
  },
  dateHeaderText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SettingsScreen;
