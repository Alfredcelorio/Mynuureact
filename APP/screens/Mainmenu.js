import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { menus, categorys, productss } from '../config/api/product';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Product = ({ title, description, price, navigation }) => (
  <View style={styles.productContainer}>
    <View style={styles.imageWrapper}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail')}>
        <Image
          source={{ uri: 'https://images.prismic.io/claseazul/54230971-073d-4a3f-a19e-5b33cf618281_Reposado-NBI.png?auto=compress,format&rect=12,0,507,1559&w=532&h=1636' }}
          style={styles.productImage}
          resizeMode="contain"
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
  const [menues, setMenues] = useState()
  const [categoryes, setCategoryes] = useState()
  const [productts, setProductts] = useState()

  const fetchProductsByRestaurant = async () => {
    try {
      const restaurantId = await AsyncStorage.getItem('uid');
      const menu = await menus(restaurantId);
      setMenues(menu)
      const menuIds = menu.map(menu => menu.id);

      const categories = await categorys(restaurantId, menuIds);
      setCategoryes(categories)
      const categoriesId = categories.map(({ menuId, id }) => ({ menuId, id }));

      const products = await productss(restaurantId, categoriesId);
      setProductts(products)


    } catch (error) {
      console.log(error)
    }
}


  useEffect(() => {
    fetchProductsByRestaurant();
  }, [])


  const products = [
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
      <ScrollView>
        {filteredCategories.map((category, index) => (
          <View key={index}>
            <Text style={styles.categoryText}>{category.name}</Text>
            <View style={styles.content}>
              {[...Array(5)].map((_, i) => (
                <Product key={i} title="Clase azul" description="A delightful mix of flavors." price="$3000" navigation={navigation} />
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
  productContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: isIpad ? windowWidth * 0.7 : windowWidth * 0.5, // Adjust width for iPad using windowWidth
  },
  productImage: {
    width: isIpad ? 320 : 263, // Adjust width for iPad
    height: isIpad ? 232 : 174, // Adjust height for iPad
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17,
    color: '#FFF',
  },
  productDescription: {
    fontSize: 8,
    fontWeight: '500',
    lineHeight: 8,
    color: '#FFF',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
    color: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2
  },
  logo: {
    width: 180,
    height: 50,
    resizeMode: 'contain',
  },
  headerText: {
    fontFamily: 'Metropolis-SemiBold',
    color: '#FFF',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.165,
    textAlign: 'left',
    marginBottom: 1,
  },
  searchBarContainer: {
    padding: 10
  },
  searchBar: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    paddingLeft: 10,
    color: '#FFF',
    marginBottom: 10,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontSize: 26,
    fontWeight: '500',
    marginBottom: 10,
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
