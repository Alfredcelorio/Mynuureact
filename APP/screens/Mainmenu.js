import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Product = ({ title, description, price, navigation }) => (
  <View style={styles.productContainer}>
    <View style={styles.imageWrapper}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail')}>
        <Image
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fullaccezz-2756a.appspot.com/o/products%2FBelle%20Glos%22Las%20Alturas%22.jpg?alt=media&token=1920d397-9cc3-4a74-bc29-bcfa11aa815e' }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
    <Text style={styles.productTitle}>{title}</Text>
    <Text style={styles.productDescription}>{description}</Text>
    <Text style={styles.productPrice}>{price}</Text>
  </View>
);

const isIpad = Platform.OS === 'ios' && (windowWidth >= 768 || windowHeight >= 768);

const Mainmenu = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = React.useState('');

  const products = [
    { title: "Clase azul", description: "A delightful mix of flavors.", price: "$3000" },
    { title: "Clase azul", description: "A delightful mix of flavors.", price: "$3000" },
    { title: "Clase azul", description: "A delightful mix of flavors.", price: "$3000" },
    { title: "Clase azul", description: "A delightful mix of flavors.", price: "$3000" },
    // ... (You can add more products here if needed)
  ];

  const categories = [
    { name: 'Featured Items', products: products },
    { name: 'Vodka', products: products },
    { name: 'Whiskey', products: products },
    { name: 'Rum', products: products }
  ];

  const filteredCategories = categories.filter(category => {
    if (category.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    }
    return category.products.some(product =>
      product.title.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#000', 'white']} style={styles.gradient}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fullaccezz-2756a.appspot.com/o/products%2F41c53523-ce06-4502-aad3-29b8545ee02d?alt=media&token=4932c29c-1f4c-413e-894d-1ca4035dd141' }} style={styles.logo} />
        </View>
      </LinearGradient>
      <ScrollView>
      <View style={styles.topBar}>
        <Text style={styles.headerText}> Welcome to Cantina la 20,</Text>
      </View>
      <View style={styles.searchBarContainer}>
        <Text style={styles.headerText}> This is your drink menu</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('CustomDropdown')}>
          <Text style={styles.buttonText}>Change menu</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
        {filteredCategories.map((category, index) => (
          <View key={index}>
            <Text style={styles.categoryText}>{category.name}</Text>
            <View style={styles.productRow}>
              {category.products.map((product, i) => (
                <Product key={i} title={product.title} description={product.description} price={product.price} navigation={navigation} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Button component */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 150,
  },
  logo: {
    width: 150,
    height: 70,
    resizeMode: 'contain',
  },
  
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: 'Metropolis-SemiBold',
    color: '#FFF',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.165,
    textAlign: 'lefcent',
    marginBottom: 1,
  },
  searchBarContainer: {
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    paddingLeft: 10,
    color: '#fff',
    marginBottom: 10,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryText: {
    fontSize: 35,
    fontWeight: '500',
    marginBottom: 10,
    color: '#FFF',
    textAlign: 'center',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  productContainer: {
    width: '45%',
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  productImage: {
    resizeMode: 'contain',
    width: '100%',
    height: 280,

  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 5,   // Add a bit of margin at the top to separate from the image
    color: '#FFF',
  },
  productDescription: {
    fontSize: 12,
    marginHorizontal: 5,   // Add a bit of margin at the top to separate from the title
    color: '#FFF',
  },
  productPrice: {
    fontSize: 12,
    marginHorizontal: 5,
    color: '#FFF',
  },
  buttonContainer: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
  },
});

export default Mainmenu;
