import React, { useEffect, useState } from 'react';
import {Dimensions, Platform, View, Image, StyleSheet, Text, ScrollView,  SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { menus, categories, products } from '../config/api/product';
import { useRoute } from '@react-navigation/native';

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


const TypingText = Animatable.createAnimatableComponent(Text);

const imageUris = [
  'https://images.prismic.io/claseazul/54230971-073d-4a3f-a19e-5b33cf618281_Reposado-NBI.png?auto=compress,format&rect=12,0,507,1559&w=532&h=1636',
  // Add more image URLs here
];


const ProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [animationDelay, setAnimationDelay] = useState(0);
  const [menus, setMenus] = useState();
  const { productData } = route.params;


  const filteredProductData = {
    ABV: productData.abv || "",
    body: productData.body || "",
    brand: productData.brand || "",
    countryState: productData.countryState || "",
    region: productData.region || "",
    sku: productData.sku || "",
    taste: productData.taste || "",
    type: productData.type || "",
    varietal: productData.varietal || "",
  };


  useEffect(() => {
    // Set a delay before the animation starts (for a typing effect)
    const delay = 1000; // You can adjust this delay according to your preference
    setAnimationDelay(delay);
  }, []);

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Text style={styles.goBackText}>← </Text>
      </TouchableOpacity>
      <Text style={styles.headerText}> Welcome to Cantina la 20,</Text>
        <View style={styles.contentContainer}>
         <TypingText
            animation="typingFade"
            duration={800}
            delay={animationDelay}
            style={styles.title}
          >
            {productData.name}
          </TypingText>
          <Image 
            source={{ uri: productData.image }}
            style={styles.image}
            resizeMode="contain"
          />

          <TypingText
            animation="typingFade"
            duration={1000}
            delay={animationDelay + 600} // Add delay for a typing effect
            style={styles.description}
          >
            {productData.description}
          </TypingText>

          <View style={styles.priceContainer}>
            <TypingText
              animation="typingFade"
              duration={4000}
              delay={animationDelay + 900} // Add delay for a typing effect
              style={styles.price}
            >
              {productData.price}
            </TypingText>
          </View>

          <View style={styles.additionalInfoContainer}>
            {Object.entries(filteredProductData).map(([key, value]) => (
              <View style={styles.additionalInfoItem} key={key}>
                <Text style={styles.additionalInfoLabel}>{key}</Text>
                <Text style={styles.additionalInfoValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: "100%",
    height: "100%",
    paddingHorizontal: 20, 
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",

  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height:  isIpad ?  600 : 300,
    marginTop: 100,
  },
  title: {
    fontFamily: 'Metropolis-Medium',
    fontSize:  isIpad ?   40 : 20,
    fontWeight: '600',
    lineHeight: isIpad ?  48 : 29,
    letterSpacing: -0.25437501072883606,
    textAlign: 'left',
    marginTop: 70,
    color: 'white',
  },
  description: {
    fontFamily: 'Metropolis-Bold',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 20,
    color: 'white',
  },
  priceContainer: {
    width: '100%',
    height: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 40, 
  },
  price: {
    fontFamily: 'Metropolis-SemiBold',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'left',
    color: 'white',
  },
  additionalInfoContainer: {
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
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
    top:  isIpad ? 40: 10,
    right: 15,
    left: -10,
    zIndex: 100,
    padding: 20,
  },
  goBackText: {
    fontSize: 30,
    fontWeight: '500',
    color: 'white',
  },
});

export default ProductScreen;
