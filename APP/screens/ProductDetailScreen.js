import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

Animatable.initializeRegistryWithDefinitions({
  typingFade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const TypingText = Animatable.createAnimatableComponent(Text);
const TypingView = Animatable.createAnimatableComponent(View);

const ProductScreen = () => {
  const navigation = useNavigation();
  const windowWidth = useWindowDimensions().width;
  const [animationDelay, setAnimationDelay] = useState(0);

  useEffect(() => {
    // Set a delay before the animation starts (for a typing effect)
    const delay = 1000; // You can adjust this delay according to your preference
    setAnimationDelay(delay);
  }, []);

  const isLandscape = windowWidth > 500;

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
      Varietal: 'Blue Agave',
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Text style={styles.goBackText}>← Go Back</Text>
      </TouchableOpacity>

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
          duration={2000}
          delay={animationDelay + 900} // Add delay for a typing effect
          style={styles.price}
        >
          {productData.price}
        </TypingText>
      </View>

      <TypingView // Apply fade-in effect to the entire additional info container
        animation="typingFade"
        duration={1000} // Adjust the duration according to your preference
        delay={animationDelay + 1200} // Add delay for a typing effect
        style={styles.additionalInfoContainer} // Apply styles to the TypingView component
      >
        <ScrollView>
          {Object.entries(productData.additionalInfo).map(([key, value]) => (
            <View style={styles.additionalInfoItem} key={key}>
              <Text style={styles.additionalInfoLabel}>{key}</Text>
              <Text style={styles.additionalInfoValue}>{value}</Text>
            </View>
          ))}
        </ScrollView>
      </TypingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Set background color to black
    paddingHorizontal: 20,
  },
  goBackButton: {
    position: 'absolute',
    top: 50,
    left: 40,
  },
  goBackText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white', // Set text color to white
  },
  image: {
    width: 300,
    height: 500,
    marginTop: 70,
  },
  title: {
    fontFamily: 'Metropolis-Medium',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    letterSpacing: -0.25437501072883606,
    textAlign: 'left',
    marginTop: 20,
    color: 'white', // Set text color to white
  },
  description: {
    fontFamily: 'Metropolis-Bold',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'left',
    marginTop: 10,
    color: 'white', // Set text color to white
  },
  priceContainer: {
    width: 115,
    height: 28,
    borderWidth: 1,
    justifyContent: 'flex-start', // Align text to the left
    alignItems: 'flex-start', // Align text to the left
    marginTop: 20,
},
price: {
    fontFamily: 'Metropolis-SemiBold',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: 0,
    textAlign: 'left',
    color: 'white', // Set text color to white
},
  additionalInfoContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
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
    color: 'white', // Set text color to white
  },
  additionalInfoValue: {
    fontFamily: 'Metropolis-Regular',
    fontSize: 16,
    fontWeight: '400',
    color: 'white', // Set text color to white
  },
  reservationButton: {
    position: 'absolute',
    bottom: '5%',
    width: '90%',
    padding: 15,
    backgroundColor: 'white', // Set background color to white
    borderColor: 'black', // Set border color to black
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  reservationButtonText: {
    fontFamily: 'Metropolis-ExtraBold',
    color: 'black', // Set text color to black
    fontSize: 20,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'column', // Vertical layout by default
    alignItems: 'center', // Align items vertically in the center
  },
  landscapeContent: {
    flexDirection: 'row', // Horizontal layout for landscape mode
    alignItems: 'flex-start', // Align items to the left
  },
  imageContainer: {
    flex: 1, // Take 50% of the available width in landscape mode
    justifyContent: 'flex-start', // Align child items to the start (left) of the container
  },
  textContainer: {
    flex: 1, // Take 50% of the available width in landscape mode
    paddingHorizontal: 20,
  },
});

export default ProductScreen;
