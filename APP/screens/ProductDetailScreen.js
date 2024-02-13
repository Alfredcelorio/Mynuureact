import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import {Dimensions, Platform, View, Image, StyleSheet, Text, SafeAreaView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Item from '../component/tabnavegation/Item';
import History from '../component/tabnavegation/History';
import Settings from '../component/tabnavegation/Settings';
import Inventory from '../component/tabnavegation/Invetory';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const isIpad =
  Platform.OS === 'ios' &&
  ((windowWidth >= 768 && windowHeight >= 1024) || // iPad Pro 12.9" or similar
   (windowWidth >= 768 && windowHeight >= 768));

Animatable.initializeRegistryWithDefinitions({
  typingFade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const TopTab = createMaterialTopTabNavigator();

const InventoryScreen = () => <View><Text>Inventory Screen</Text></View>;
const SettingsScreen = () => <View><Text>Settings Screen</Text></View>;
const HistoryScreen = () => <View><Text>History Screen</Text></View>;

function TopTabNavigator() {
  const route = useRoute();
  const { productData } = route.params;
  return (
    <TopTab.Navigator
      initialRouteName="Item"
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'black' },
        tabBarIndicatorStyle: { backgroundColor: 'white' },
      }}
    >
      <TopTab.Screen name="Item">
        {props => <Item {...props} productData={productData} />}
      </TopTab.Screen>
      <TopTab.Screen name="Inventory" component={Inventory} />
      <TopTab.Screen name="Settings" component={Settings} />
      <TopTab.Screen name="History" component={History} />
    </TopTab.Navigator>
  );
}

const ProductScreen = () => {
  return (
      <SafeAreaView style={styles.container}>
        <TopTabNavigator />
      </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 320,
    resizeMode: 'contain',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  price: {
    fontSize: 19,
    fontWeight: '400',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  additionalInfoContainer: {
    width: '100%',
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'white', // bold border color
    padding: 14,
  },

  additionalInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  additionalInfoLabel: {
    fontFamily: 'Metropolis-Bold',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  additionalInfoValue: {
    fontFamily: 'Metropolis-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
  },
  goBackButton: {
    position: 'absolute',
    top: isIpad ? 40 : 2,
    right: 15,
    left: 15,
    zIndex: 100,
    padding: 10,
  },
  goBackText: {
    fontSize: 30,
    fontWeight: '500',
    color: 'white',
  },
});

export default ProductScreen;
