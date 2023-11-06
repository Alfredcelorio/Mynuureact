import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { menusApi, categoriesApi, productsApi } from '../config/api/product';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Product = ({ productData, image, title, description, price, navigation }) => 
{
  console.log(description)
  return (
  <View style={styles.productContainer}>
    <View style={styles.imageWrapper}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { productData })}>
        <Image
          source={{ uri: image }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
    <Text style={styles.productTitle}>{title}</Text>
    {description && (
      <Text style={styles.productDescription}>{description}</Text>
    )}
    <Text style={styles.productPrice}>{price}$</Text>
  </View>
  )
};

const isIpad = Platform.OS === 'ios' && (windowWidth >= 768 || windowHeight >= 768);

const Mainmenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchText, setSearchText] = React.useState('');
  const [menues, setMenues] = useState()
  const [categoryes, setCategoryes] = useState()
  const [productts, setProductts] = useState()
  const [menuChanged, setMenuChanged] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const fetchProductsByRestaurant = async () => {
    try {
      console.log('ENTRA')
      const selectMenu = await AsyncStorage.getItem("menuId");
      const restaurantId = await AsyncStorage.getItem('uid');
      const menu = await menusApi(restaurantId);
      setMenues(menu)
      const menuIds = menu.map(menu => menu.id);
      const onlyOneMenus = selectMenu ? [selectMenu] : [menuIds?.[0]]

      const categories = await categoriesApi(restaurantId, onlyOneMenus);
      setCategoryes(categories)
      const categoriesId = categories.map(({ menuId, id }) => ({ menuId, id }));

      const products = await productsApi(restaurantId, categoriesId);
      setProductts(products)
      console.log(products)
      setData(products);
      setFilteredData(products);

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (route.params && route.params.menuChanged) {
      fetchProductsByRestaurant();
      setMenuChanged(false);
    }
  }, [route.params])

  useEffect(() => {
    fetchProductsByRestaurant();
  }, [])

  useEffect(() => {
    const filtered = data.map(category => {
      const filteredProducts = category.products.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      return { ...category, products: filteredProducts };
    });

    setFilteredData(filtered);
  }, [searchText, data]);

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
        {filteredData?.map((category, index) => (
          <View key={index}>
            <Text style={styles.categoryText}>{category.categoryName}</Text>
            <View style={styles.productRow}>
              {category.products.map((product, i) => (
                <Product key={i} productData={product} image={product.image} title={product.name} description={product.description} price={product.price} navigation={navigation} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
    marginTop: 10,
  },
  productDescription: {
    fontSize: 12,
    marginHorizontal: 5,   // Add a bit of margin at the top to separate from the title
    color: '#FFF',
    marginTop: 3,
  },
  productPrice: {
    fontSize: 12,
    marginHorizontal: 5,
    color: '#FFF',
    marginTop: 3,
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
