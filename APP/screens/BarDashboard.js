import React, { useState } from "react";
import { StyleSheet, ScrollView, View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import { NativeBaseProvider } from 'native-base';
import { ProgressCircle } from 'react-native-svg-charts';

// Helper function to format month keys
const formatMonthKey = date => `${date.getFullYear()}-${date.getMonth() + 1}`;

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [purchases, setPurchases] = useState({});
  const [newPurchase, setNewPurchase] = useState('');
  const [weeklySales, setWeeklySales] = useState(Array(4).fill(''));
  const [barCostPercentage, setBarCostPercentage] = useState(null);

  const handleAddWeeklySale = (index, value) => {
    const updatedSales = weeklySales.map((sale, saleIndex) => saleIndex === index ? value : sale);
    setWeeklySales(updatedSales);
  };

  const addPurchase = () => {
    const monthKey = formatMonthKey(currentMonth);
    const purchaseWithDate = {
      amount: Number(newPurchase),
      date: new Date().toLocaleDateString() // Stores the current date as a string
    };
    const updatedPurchases = {
      ...purchases,
      [monthKey]: [...(purchases[monthKey] || []), purchaseWithDate]
    };
    setPurchases(updatedPurchases);
    setNewPurchase('');
  };

  const calculateBarCostPercentage = () => {
    const totalSales = weeklySales.reduce((acc, curr) => acc + Number(curr), 0);
    const monthKey = formatMonthKey(currentMonth);
    // Update this line to sum the amount property of each purchase
    const totalPurchases = purchases[monthKey]?.reduce((acc, purchase) => acc + purchase.amount, 0) || 0;
    if (totalSales > 0 && totalPurchases > 0) {
      const percentage = (totalPurchases / totalSales) * 100;
      setBarCostPercentage(percentage.toFixed(2));
    } else {
      alert('Please enter valid numbers for all purchases and weekly sales.');
    }
  };

  const changeMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction));
    // Optionally reset sales data for the new month
    setWeeklySales(Array(4).fill(''));
    setBarCostPercentage(null); // Reset percentage calculation for new month
  };

  const getTotalPurchasesForMonth = () => {
    const monthKey = formatMonthKey(currentMonth);
    // Sum up the amount for each purchase in the given month
    return purchases[monthKey]?.reduce((acc, purchase) => acc + purchase.amount, 0) || 0;
  };

  const deletePurchase = (index) => {
    const monthKey = formatMonthKey(currentMonth);
    const updatedPurchases = purchases[monthKey].filter((_, purchaseIndex) => purchaseIndex !== index);
    setPurchases({ ...purchases, [monthKey]: updatedPurchases });
  };

  return (
    <NativeBaseProvider>
      <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Bar Cost Calculator</Text>
        <View style={styles.progressContainer}>
          <ProgressCircle
            style={styles.progressCircle}
            progress={Number(barCostPercentage) / 100}
            progressColor="green"
            backgroundColor="#141414"
            strokeWidth={14}
          />
          <Text style={styles.percentageText}>
            {barCostPercentage}%
          </Text>
        </View>
          <View style={styles.monthNavigation}>
            <Button title="Prev" onPress={() => changeMonth(-1)} color="#3498db" />
            <Text style={styles.monthLabel}>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
            <Button title="Next" onPress={() => changeMonth(1)} color="#3498db" />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setNewPurchase}
            value={newPurchase}
            placeholder="Enter New Purchase"
            placeholderTextColor="#7f8c8d"
            keyboardType="numeric"
          />
          <Button title="Add Purchase" onPress={addPurchase} color="#3498db" />
          {weeklySales.map((sale, index) => (
            <TextInput
              key={index}
              style={styles.input}
              onChangeText={(value) => handleAddWeeklySale(index, value)}
              value={sale}
              placeholder={`Enter Sales for Week ${index + 1}`}
              keyboardType="numeric"
            />
          ))}
          <Button title="Calculate Cost Percentage" onPress={calculateBarCostPercentage} color="#3498db" />
          {barCostPercentage !== null && (
            <>
            
            </>
          )}
          <Text style={styles.totalPurchasesText}>
           Total Purchases: ${getTotalPurchasesForMonth().toFixed(2)}
            </Text>
          <Text style={styles.purchasesHeader}>Purchases:</Text>
          {purchases[formatMonthKey(currentMonth)]?.map((purchase, index) => (
          <View key={index} style={styles.purchaseItemContainer}>
             <Text style={styles.purchaseItem}>
              {`Purchase ${index + 1}: $${purchase.amount.toFixed(2)} on ${purchase.date}`}
              </Text>
             <TouchableOpacity onPress={() => deletePurchase(index)} style={styles.deleteButton}>
           <Text style={styles.deleteButtonText}>Delete</Text>
           </TouchableOpacity>
            </View>
              ))}
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#000', // Black background
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Black background
  },
  header: {
    fontSize: 20,
    color: '#3498db', // Blue text
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthLabel: {
    fontSize: 16,
    color: '#3498db', // Blue text
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    color: '#fff', // White text for input
    backgroundColor: '#333', // Darker background for input
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    color: '#3498db', // Blue text
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressCircle: {
    height: 200,
    marginVertical: 20,
  },
  totalPurchasesText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db', // Blue text
    marginBottom: 10,
  },
  purchasesHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db', // Blue text
  },
  purchaseItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  purchaseItem: {
    fontSize: 14,
    color: '#fff', // White text
  },
  deleteButton: {
    backgroundColor: '#e74c3c', // Red color for delete button
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'black', // White text for delete button
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressCircle: {
    height: 200,
    width: 200, // Ensure the width is the same as the height for a perfect circle
  },
  percentageText: {
    position: 'absolute',
    fontSize: 48, // Large, bold font size for the percentage text
    color: 'white', // White color for the percentage text
    fontWeight: 'bold',
  },
});
