import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, useWindowDimensions, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { menus, categories, products } from '../config/api/product';

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
  const windowWidth = useWindowDimensions().width;
  const [animationDelay, setAnimationDelay] = useState(0);
  const [menus, setMenus] = useState();

  useEffect(() => {
    // Set a delay before the animation starts (for a typing effect)
    const delay = 1000; // You can adjust this delay according to your preference
    setAnimationDelay(delay);
  }, []);

  const productData = {
    name: 'Clase azul',
    description: 'Clase Azul Tequila Reposado is a symbol of Mexican tradition and culture. Made with slow-cooked 100% Blue Weber Agave, our ultra-premium reposado tequila is unique and incomparable.',
    price: '$3000',
    // Additional information based on the type of liquor
    additionalInfo: {
      ABV: '40%', // Alcohol by volume
      Body: 'Full-bodied',
      Brand: 'Clase Azul',
      CountryState: 'Mexico',
      Region: 'Jalisco',
      Sku: '123456789',
      Taste: 'Smooth and rich',
      Type: 'Tequila',
      Varietal: 'Blue Agave ',
    },
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Text style={styles.goBackText}>← </Text>
      </TouchableOpacity>
      <Text style={styles.headerText}> Welcome to Cantina la 20,</Text>
        <View style={styles.contentContainer}>
          <Image 
            source={{ uri: 'https://images.prismic.io/claseazul/54230971-073d-4a3f-a19e-5b33cf618281_Reposado-NBI.png?auto=compress,format&rect=12,0,507,1559&w=532&h=1636' }}
            style={styles.image}
            resizeMode="contain"
          />

          <TypingText
            animation="typingFade"
            duration={800}
            delay={animationDelay}
            style={styles.title}
          >
            {productData.name}
          </TypingText>

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
            {Object.entries(productData.additionalInfo).map(([key, value]) => (
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    width: '98%', 
  },
  contentContainer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', // Take full width of the parent container
    height: 400, // Set a fixed height or adjust as needed
    marginTop: 100,
  },
  title: {
    fontFamily: 'Metropolis-Medium',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    letterSpacing: -0.25437501072883606,
    textAlign: 'left',
    marginTop: 20,
    color: 'white',
  },
  description: {
    fontFamily: 'Metropolis-Bold',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'left',
    marginTop: 10,
    color: 'white',
  },
  priceContainer: {
    width: '100%',
    height: 28,
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
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
    borderWidth: 1, // Set border width
    borderColor: 'white', // Set border color
    padding: 10, // Optional padding inside the border
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
    top: 20,
    left: 20,
    zIndex: 1, 
    
  },
  goBackText: {
    fontSize: 30, // Adjusted font size
    fontWeight: '500',
    color: 'white',
  }
});

export default ProductScreen;
