import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
} from "react-native";
import { NativeBaseProvider } from "native-base";
import { ProgressCircle } from "react-native-svg-charts";
// context
import { AuthContext } from "../context/context";
// API
import {
  createItemCustom,
  getItemsByConditionGuest,
  updateItem,
} from "../services/conx/settings";

// Helper function to format month keys
const formatMonthKey = (date) => `${date.getFullYear()}-${date.getMonth() + 1}`;

export default function App() {
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [purchases, setPurchases] = useState({});
  const [newPurchase, setNewPurchase] = useState("");
  const [weeklySales, setWeeklySales] = useState(Array(4).fill(""));
  const [barCostPercentage, setBarCostPercentage] = useState(null);
  const [countChange, setCountChange] = useState(0)
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, [currentMonth]);
  
  const getData = async () => {
    try {
      const response = await getItemsByConditionGuest(
        user.uid,
        "barCalculations",
        "restaurantId"
      );
  
      const [destrucObj] = response;
      setData(destrucObj);
  
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth());
      const dateOfDBDate = formatMonthKey(date);
  
      for (const fecha in destrucObj.barDashBoard) {
        if (fecha === dateOfDBDate) {
          setBarCostPercentage(destrucObj.barDashBoard[fecha].barCostPercentage);
          setWeeklySales(destrucObj.barDashBoard[fecha].weeklySales);
          setPurchases(destrucObj.barDashBoard[fecha].purchases);
          return;
        }
      }

      setBarCostPercentage(null);
      setWeeklySales(Array(4).fill(""));
      setPurchases({});
    } catch (error) {
      console.log("Error useEffect: ", error);
    }
  };

  const handleAddWeeklySale = (index, value) => {
    const updatedSales = weeklySales.map((sale, saleIndex) =>
      saleIndex === index ? value : sale
    );
    setWeeklySales(updatedSales);
  };

  const addPurchase = () => {
    const monthKey = formatMonthKey(currentMonth);
    const purchaseWithDate = { amount: Number(newPurchase) };

    setPurchases(prevPurchases => ({
      ...prevPurchases,
      [monthKey]: [...(prevPurchases[monthKey] || []), purchaseWithDate],
    }));
  
    setNewPurchase('');
    setCountChange(1)
  };

  useEffect(() => {
    if (purchases[formatMonthKey(currentMonth)]) {
      sendInfo();
    }
  }, [countChange]);

  const calculateBarCostPercentage = () => {
    const totalSales = weeklySales.reduce((acc, curr) => acc + Number(curr), 0);
    const monthKey = formatMonthKey(currentMonth);
  
    const totalPurchases = purchases[monthKey]?.reduce(
      (acc, purchase) => acc + purchase.amount,
      0
    ) || 0;
  
    if (totalSales > 0 && totalPurchases > 0) {
      const percentage = (totalPurchases / totalSales) * 100;
      setBarCostPercentage(percentage.toFixed(2));
      setCountChange(-1)
    } else {
      alert("Please enter valid numbers for all purchases and weekly sales.");
    }
  };

  useEffect(() => {
    if (barCostPercentage !== null) {
      sendInfo();
    }
  }, [countChange]);

  const changeMonth = (direction) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction)
    );
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + direction
    );

    // Optionally reset sales data for the new month
    setWeeklySales(Array(4).fill(""));
    setBarCostPercentage(null); // Reset percentage calculation for new month
  };

  const getTotalPurchasesForMonth = () => {
    const monthKey = formatMonthKey(currentMonth);
    // Sum up the amount for each purchase in the given month
    return (
      purchases[monthKey]?.reduce(
        (acc, purchase) => acc + purchase.amount,
        0
      ) || 0
    );
  };

  const deletePurchase = async (index) => {
    const monthKey = formatMonthKey(currentMonth);
    const updatedPurchases = purchases[monthKey].filter(
      (_, purchaseIndex) => purchaseIndex !== index
    );
  
    setPurchases({ ...purchases, [monthKey]: updatedPurchases });
  
    const updatedData = {
      ...data,
      barDashBoard: {
        ...data.barDashBoard,
        [monthKey]: {
          ...data.barDashBoard[monthKey],
          purchases: updatedPurchases,
        },
      },
    };
  
    try {
      await updateItem(data.id, updatedData, 'barCalculations');
      console.log('perfect');
    } catch (error) {
      console.error('Error delete:', error);
    }
  };

  const sendInfo = async () => {
    try {
      const dashBoardExist = await getItemsByConditionGuest(
        user.uid,
        "barCalculations",
        "restaurantId"
      );
  
      if (dashBoardExist.length === 0) {
        const obj = {
          restaurantId: user.uid,
          barDashBoard: {
            [formatMonthKey(currentMonth)]: {
              purchaseCost: Number(barCostPercentage) / 100,
              barCostPercentage: barCostPercentage,
              newPurchase: newPurchase,
              weeklySales: weeklySales,
              totalPurchases: getTotalPurchasesForMonth(),
              purchases: purchases,
            },
          },
        };
        await createItemCustom(obj, "barCalculations");
      } else {
        const existingDashboard = dashBoardExist[0].barDashBoard;
        const currentMonthKey = formatMonthKey(currentMonth);
        const updatedMonthData = {
          purchaseCost: Number(barCostPercentage) / 100,
          newPurchase: newPurchase,
          weeklySales: weeklySales,
          barCostPercentage: barCostPercentage,
          totalPurchases: getTotalPurchasesForMonth(),
          purchases: purchases,
        };
  
        // Actualización parcial del objeto
        const updatedDashboard = {
          ...existingDashboard,
          [currentMonthKey]: {
            ...existingDashboard[currentMonthKey],
            ...updatedMonthData,
          },
        };
  
        await updateItem(
          dashBoardExist[0].id,
          { barDashBoard: updatedDashboard },
          "barCalculations"
        );
      }
    } catch (error) {
      console.error("Error al enviar información a Firebase:", error);
    }
  };

  return (
    <NativeBaseProvider>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.header}>Bar Cost Calculator</Text>
          <View style={styles.progressContainer}>
            <ProgressCircle
              style={styles.progressCircle}
              progress={
                Number(barCostPercentage) / 100
              }
              progressColor="green"
              backgroundColor="#141414"
              strokeWidth={14}
            />
            <Text style={styles.percentageText}>{barCostPercentage}%</Text>
          </View>
          <View style={styles.monthNavigation}>
            <Button
              title="Prev"
              onPress={() => changeMonth(-1)}
              color="#3498db"
            />
            <Text style={styles.monthLabel}>
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Button
              title="Next"
              onPress={() => changeMonth(1)}
              color="#3498db"
            />
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
          <Button
            title="Calculate Cost Percentage"
            onPress={calculateBarCostPercentage}
            color="#3498db"
          />
          {barCostPercentage !== null && <></>}
          <Text style={styles.totalPurchasesText}>
            Total Purchases: ${getTotalPurchasesForMonth().toFixed(2)}
          </Text>
          <Text style={styles.purchasesHeader}>Purchases:</Text>
          {purchases[formatMonthKey(currentMonth)]?.map((purchase, index) => (
            <View key={index} style={styles.purchaseItemContainer}>
              <Text style={styles.purchaseItem}>
                {`Purchase ${index + 1}: $${purchase.amount.toFixed(2)}`}
              </Text>
              <TouchableOpacity
                onPress={() => deletePurchase(index)}
                style={styles.deleteButton}
              >
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
    backgroundColor: "#000", // Black background
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000", // Black background
  },
  header: {
    fontSize: 20,
    color: "#3498db", // Blue text
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthLabel: {
    fontSize: 16,
    color: "#3498db", // Blue text
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
    color: "#fff", // White text for input
    backgroundColor: "#333", // Darker background for input
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    color: "#3498db", // Blue text
    fontWeight: "bold",
    textAlign: "center",
  },
  progressCircle: {
    height: 200,
    marginVertical: 20,
  },
  totalPurchasesText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db", // Blue text
    marginBottom: 10,
  },
  purchasesHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db", // Blue text
  },
  purchaseItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  purchaseItem: {
    fontSize: 14,
    color: "#fff", // White text
  },
  deleteButton: {
    backgroundColor: "#e74c3c", // Red color for delete button
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "black", // White text for delete button
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  progressCircle: {
    height: 200,
    width: 200, // Ensure the width is the same as the height for a perfect circle
  },
  percentageText: {
    position: "absolute",
    fontSize: 48, // Large, bold font size for the percentage text
    color: "white", // White color for the percentage text
    fontWeight: "bold",
  },
});
