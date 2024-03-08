import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import {
  NativeBaseProvider,
  Button,
  VStack,
  Text,
  Box,
  Select,
  CheckIcon,
  Icon,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { AuthContext } from "../../context/context";
import { useFocusEffect } from "@react-navigation/native";
import {
  updateItem,
  getItemsByConditionGuest,
  createItemCustom,
} from "../../services/conx/settings";

const InventoryScreen = ({ productData, id }) => {
  const { user, routerName, setRouterName } = useContext(AuthContext);
  const inventoryProd = productData?.inventory?.[0];
  const [selectedBar, setSelectedBar] = useState(inventoryProd?.chooseBar);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedBottles, setSelectedBottles] = useState(
    inventoryProd?.quantity
  );
  const [selectedServings, setSelectedServings] = useState(
    inventoryProd?.servings
  );

  useFocusEffect(
    React.useCallback(() => {
      const updatedProducts = routerName.map((product) =>
        product === route.name ? route.name : product
      );
      setRouterName(updatedProducts);
    }, [])
  );

  const quantityOptions = Array.from({ length: 20 }, (_, i) => `${i + 1}`);

  const handleUpdateInventory = async () => {
    try {
      setSubmitLoading(true);
      const time = Timestamp.fromDate(new Date()).toDate();
      const updatedInventory = {
        ...inventoryProd,
        chooseBar: selectedBar || null,
        quantity: selectedBottles || null,
        servings: selectedServings || null,
      };

      const updatedProductData = {
        ...productData,
        inventory: [updatedInventory],
      };

      const logInventory = await getItemsByConditionGuest(
        productData?.restaurantId,
        "logInventory",
        "idRestaurant"
      );

      const oldData = {};
      const newData = {};

      if (selectedBar !== inventoryProd?.chooseBar) {
        oldData.chooseBar = inventoryProd?.chooseBar || null;
        newData.chooseBar = selectedBar;
      }

      if (selectedBottles !== inventoryProd?.quantity) {
        oldData.quantity = inventoryProd?.quantity || null;
        newData.quantity = selectedBottles;
      }

      if (selectedServings !== inventoryProd?.servings) {
        oldData.servings = inventoryProd?.servings || null;
        newData.servings = selectedServings;
      }

      const filteredNewData =
        Object.keys(newData).length !== 0 ? [newData] : [];

      if (logInventory?.length === 0) {
        const logObjet = {
          idRestaurant: productData?.restaurantId,
          log: [
            {
              user: user?.displayName,
              email: user?.email,
              type: "new product in log - mobile",
              time,
              nameItem: productData?.name,
              idItem: id,
              newData: filteredNewData,
              oldData: [],
            },
          ],
        };

        await createItemCustom(logObjet, "logInventory");

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Access granted",
          position: "bottom",
          style: { backgroundColor: "black", zIndex: 1000 },
        });
      }

      const filteredOldData =
        Object.keys(oldData).length !== 0 ? [oldData] : [];

      if (logInventory?.length !== 0) {
        const logObjetUpdate = {
          idRestaurant: productData?.restaurantId,
          log: [
            ...(logInventory[0]?.log || ""),
            {
              user: user?.displayName,
              email: user?.email,
              type: "edit product - mobile",
              time,
              nameItem: productData?.name,
              idItem: id,
              newData: filteredNewData,
              oldData: filteredOldData,
            },
          ],
        };

        await updateItem(logInventory[0]?.id, logObjetUpdate, "logInventory");

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Access granted",
          position: "bottom",
          style: { backgroundColor: "black", zIndex: 1000 },
        });
      }

      console.log('updatedProductData: ', updatedProductData)

      await updateItem(id, updatedProductData, "products");
      const updatedProducts = routerName.map((product) =>
        product === route.name ? route.name : product
      );
      setRouterName(updatedProducts);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Access granted",
        position: "bottom",
        style: { backgroundColor: "black", zIndex: 1000 },
      });
      setSubmitLoading(false);
    } catch (error) {
      console.log("ERROR: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Something seems to have gone wrong when trying to update the file: ${error.message}`,
        text2NumberOfLines: 5,
        position: "bottom",
        style: { backgroundColor: "black" },
      });
      setSubmitLoading(false);
    }
  };

  return (
    <NativeBaseProvider>
      <>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Toast setRef={(ref) => Toast.setRef(ref)} />
            <Box style={styles.header}>
              <Text style={styles.headerText}>Inventory Management</Text>
            </Box>
            <VStack space={5} alignItems="center" style={styles.formContainer}>
              <Select
                defaultValue={inventoryProd?.chooseBar}
                selectedValue={selectedBar}
                minWidth="90%"
                accessibilityLabel="Choose Bar"
                placeholder="Choose Bar"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={4} />,
                }}
                mt={1}
                onValueChange={(itemValue) => setSelectedBar(itemValue)}
              >
                <Select.Item label="Bar 1" value="bar1" />
                <Select.Item label="Bar 2" value="bar2" />
                <Select.Item label="Bar 3" value="bar3" />
              </Select>
              <Select
                defaultValue={inventoryProd?.quantity}
                selectedValue={selectedBottles}
                minWidth="90%"
                accessibilityLabel="Number of Bottles"
                placeholder="Number of Bottles"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={4} />,
                }}
                mt={1}
                onValueChange={(itemValue) => setSelectedBottles(itemValue)}
              >
                {quantityOptions.map((value) => (
                  <Select.Item key={value} label={value} value={value} />
                ))}
              </Select>
              <Select
                defaultValue={inventoryProd?.servings}
                selectedValue={selectedServings}
                minWidth="90%"
                accessibilityLabel="Number of Servings"
                placeholder="Number of Servings"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={4} />,
                }}
                mt={1}
                onValueChange={(itemValue) => setSelectedServings(itemValue)}
              >
                {quantityOptions.map((value) => (
                  <Select.Item key={value} label={value} value={value} />
                ))}
              </Select>
              {submitLoading ? (
                <ActivityIndicator size="large" color="#808080" />
              ) : (
                <Button
                  size="lg"
                  width="90%"
                  onPress={handleUpdateInventory}
                  backgroundColor="#222" // Button color
                  leftIcon={
                    <Icon
                      as={MaterialIcons}
                      name="update"
                      size="sm"
                      color="white"
                    />
                  }
                  _text={{ color: "white" }}
                >
                  Update Inventory
                </Button>
              )}
            </VStack>
          </ScrollView>
        </SafeAreaView>
        <Toast setRef={(ref) => Toast.setRef(ref)} />
      </>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    alignItems: "center",
    paddingVertical: 20,
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#222",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 10,
    width: "100%",
  },
});

export default InventoryScreen;
