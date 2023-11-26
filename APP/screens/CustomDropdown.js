import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { menusApi } from "../config/api/product";



const MenuScreen = ({ navigation }) => {
  const [menus, setMenus] = useState([]);
  const flatListRef = useRef(null);
  const initialIndex = useRef(0);

  const fetchMenusInit = async () => {
    const uidRestaurant = await AsyncStorage.getItem("uid");
    const allMenus = await menusApi(uidRestaurant);
    setMenus(allMenus);
  };

  useEffect(() => {
    fetchMenusInit();
  }, []);

  const handleMenus = async (menuId) => {
    const menuUser = await AsyncStorage.getItem("menuId");
    if (menuUser) {
      await AsyncStorage.removeItem("menuId");
    }
    await AsyncStorage.setItem("menuId", menuId);
    navigation.navigate('Mainmenu', { menuChanged: true });
  };

  const scrollNext = () => {
    initialIndex.current = (initialIndex.current + 1) % menus.length;
    flatListRef.current.scrollToIndex({
      animated: true,
      index: initialIndex.current,
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => handleMenus(item.id)}>
      <Text style={styles.menuItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={menus}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        onEndReached={scrollNext}
        onEndReachedThreshold={0.1}
        style={{
          marginTop: 200,

        }}
      />
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  goBackButton: {
    position: "absolute",
    bottom: 700,
    left: 20,
    zIndex: 1,
  },
  goBackButtonText: {
    fontSize: 24,
    color: "#FFF",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    marginVertical: 10,
    top: 20
  },
  menuItemText: {
  fontSize: 58,
  color: "#FFF",
  },
});

export default MenuScreen;
