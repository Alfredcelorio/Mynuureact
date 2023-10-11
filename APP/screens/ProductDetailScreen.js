import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
        <Text style={styles.goBackText}>← Go Back</Text>
      </TouchableOpacity>

      <Image 
        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fullaccezz-2756a.appspot.com/o/restaurants%2FLaveinte-logo.jpg?alt=media&token=e0dfe8ef-4177-4885-b30e-a3d157a684c4' }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>Clase azul</Text>
      <Text style={styles.description}>A premium quality tequila crafted with precision and care.</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>$3000</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  image: {
    width: 300, // You can adjust this as per your requirement
    height: 150, // You can adjust this as per your requirement
  },
  title: {
    fontFamily: 'Metropolis-Bold',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 29,
    letterSpacing: -0.25437501072883606,
    textAlign: 'left',
    marginTop: 20,
  },
  description: {
    fontFamily: 'Metropolis-Bold',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'left',
    marginTop: 10,
  },
  priceContainer: {
    width: 115,
    height: 28,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  price: {
    fontFamily: 'Metropolis-Bold',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default ProductScreen;
