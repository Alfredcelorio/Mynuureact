import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { restaurantApi } from "../config/api/auth";
import {
  getCategories,
  getProductsByMenu,
} from "../services/productsList/products";
import { getMenus } from "../services/productsList/menus";
import { getRestaurant } from "../services/productsList/restaurant";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome or other icon sets


const { width: windowWidth, height: windowHeight } = Dimensions.get("window");


const Product = ({
  productData,
  image,
  title,
  description,
  price,
  navigation,
}) => {
  return (
    
    <View style={styles.productContainer}>
      {productData.length !== 0 ? (
        <>
          <View style={styles.imageWrapper}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductDetail", { productData })
              }
            >
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
          <Text style={styles.productPrice}>{price}</Text>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

const isIpad =
  Platform.OS === 'ios' &&
  ((windowWidth >= 768 && windowHeight >= 1024) || // iPad Pro 12.9" or similar
   (windowWidth >= 768 && windowHeight >= 768));

const Mainmenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchProductsByCat, setSearchProductsByCat] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [productsByCat, setProductsByCat] = useState();
  const [selectedMenu, setSelectedMenu] = useState();
  const [categories, setCategories] = useState();
  const [menus, setMenus] = useState();
  const [isModalVisible, setIsModalVisible] = useState(true);


  const toggleMenuVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  const navigateToNoimagesmenu = () => {
    navigation.navigate('Noimagesmenu'); // Use the name of your route defined in your stack navigator
  };

  const handleMenuSelect = (menu) => {
    setIsLoading(true);
    setSelectedMenu(menu.id);
    setIsModalVisible(false);
    setSearchValue(''); // Reset the search input
    setSearchProductsByCat(''); // Reset the search results
  };



  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("email");
      const [data] = await getRestaurant(email);

      if (data) {
        if (data?.fontFamily) {
          document.querySelector("body").style.fontFamily = data?.fontFamily;
        }

        setRestaurant(data);
      }
    })();
  }, [])

  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("email");
      const [data] = await getRestaurant(email);

      if (data) {
        if (data?.fontFamily) {
          document.querySelector("body").style.fontFamily = data?.fontFamily;
        }

        const allMenus = await getMenus(data?.id);
        const allCategories = await getCategories(data?.id);

        setMenus(allMenus);
        setCategories(allCategories);
      }
    })();
  }, [route.name, productsByCat]);

  useEffect(() => {
    if (selectedMenu && categories) {
      (async () => {
        const data = await getProductsByMenu(selectedMenu);

        const productsByCategories = categories.reduce((value, nextItem) => {
          const products = data.filter(
            (item) => item?.categoryId === nextItem?.id
          );

          products.sort((a, b) => {
            if (a.position > b.position) return 1;
            if (a.position < b.position) return -1;
            return 0;
          });

          const category = { ...nextItem, products };
          if (category.products.length) value.push(category);

          return value;
        }, []);

        setProductsByCat(productsByCategories);
        setIsLoading(false);
      })();
    }
    // eslint-disable-next-line
  }, [selectedMenu]);

  useEffect(() => {
    const initViewRestaurant = async () => {
      try {
        const email = await AsyncStorage.getItem("email");
        const uid = await AsyncStorage.getItem("uid");
        const fetchRest = await restaurantApi(email, uid);
        const [objetDestruct] = fetchRest;
        setRestaurant(objetDestruct);
      } catch (err) {
        console.log(err);
      }
    };

    initViewRestaurant();
    setIsLoading(true);
  }, []);


  const handleSearchChange = (target) => {
    const value = target;
    const val = value.toLowerCase();

    setSearchValue(value.trimStart());

    if (value.trim() !== ''.toLowerCase) {
      const data = productsByCat.reduce((acc, nextCat) => {
        const fp = nextCat.products.filter((item) => item.name.toLowerCase().includes(val));

        if (fp.length) {
          fp.sort((a, b) => {
            if (a.positionInCategory > b.positionInCategory) return 1;
            if (a.positionInCategory < b.positionInCategory) return -1;
            return 0;
          });
          acc.push({ ...nextCat, products: fp });
        }

        return acc;
      }, []);

      setSearchProductsByCat(data);
    } else setSearchProductsByCat(undefined);
  };

  return (
    <>
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleMenuVisibility}
      >
        
        <View style={styles.menuModalContainer}>
          
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
             
            <ScrollView
              contentContainerStyle={styles.menuModalContent}
              showsVerticalScrollIndicator={false}
            >
              {menus?.map((menu, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMenuSelect(menu)}
                  style={styles.menuItemContainer}
                >
                  <Text style={styles.menuItemText}>{menu.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={toggleMenuVisibility} style={styles.menuIcon}>
          <Icon name="bars" size={30} color="white" />
        </TouchableOpacity>
      <ScrollView>   
        <LinearGradient colors={["#000", "white"]} style={styles.gradient}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={{
                  uri: `${restaurant.logo}`,
                }}
                style={styles.logo}
              />
            </View>
          </View>
        </LinearGradient>
          <View style={styles.topBar}>
            <Text style={styles.headerText}>
            Welcome to {restaurant?.restaurantName}
            </Text>
          </View>
          <View style={styles.searchBarContainer}>
            <Text style={styles.headerText}> This is your drink menu</Text>
           
            <TouchableOpacity
        onPress={navigateToNoimagesmenu}
        style={styles.Noimagesbutton}
      >
        <Text style={styles.noImageButtonText}>No images</Text>
      </TouchableOpacity>
            <TextInput
              style={styles.searchBar}
              placeholder="Search..."
              placeholderTextColor="#aaa"
              value={searchValue}
              onChangeText={(e) => handleSearchChange(e)}
            />
          </View>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFF" />
            </View>
          ) : searchProductsByCat !== '' ? (
            searchProductsByCat.map((category, index) => (
              <View key={index}>
                <Text style={styles.categoryText}>{category.name}</Text>
                <View style={styles.productRow}>
                  {category.products?.map((product, i) => (
                    <Product
                      key={i}
                      productData={product}
                      image={product.image}
                      title={product.name}
                      price={product.price}
                      navigation={navigation}
                    />
                  ))}
                </View>
              </View>
            ))
          ) : (
            productsByCat?.map((category, index) => (
              <View key={index}>
                <Text style={styles.categoryText}>{category.name}</Text>
                <View style={styles.productRow}>
                  {category.products?.map((product, i) => (
                    <Product
                      key={i}
                      productData={product}
                      image={product.image}
                      title={product.name}
                      price={product.price}
                      navigation={navigation}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fullaccezz-2756a.appspot.com/o/restaurants%2Fmynuu-logo.jpg?alt=media&token=1cc8633b-e0e4-45af-906b-0b1ff10ce090' }}
            style={styles.bannerImage}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  menuModalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  menuModalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemContainer: {
    marginBottom: 75,
    marginHorizontal: 100,
  },
  menuItemText: {
    fontFamily: "Metropolis-Black",
    fontSize: isIpad ? 65 : 22,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    height: 40
  },
  logoContainer: {
    backgroundColor: "black",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
    zIndex: 100,
  },
  logoWrapper: {
    width: isIpad ? 350 : 150,
    height: isIpad ? 350 : 150, // Make width and height the same
    borderRadius: isIpad ? 350 / 2 : 150 / 2, // Make sure to divide by 2 for the radius
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    zIndex: 101,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: "Metropolis-SemiBold",
    color: "#FFF",
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.165,
    textAlign: "left",
   
  },
  searchBarContainer: {
    padding: 5,
  },
  searchBar: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    paddingLeft: 10,
    color: "#fff",
    marginBottom: 10,
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryText: {
    fontSize: 35,
    fontWeight: "500",
    marginBottom: 10,
    color: "#FFF",
    textAlign: "center",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  productContainer: {
    resizeMode: "contain",
    width: "45%",
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: isIpad ? 500: 280,
    marginTop: 10,
  },
  productTitle: {
    fontSize: isIpad ? 28 : 16,
    fontWeight: "bold",
    margin: 5,
    color: "#FFF",
    marginTop: 10,
  },
  
  productPrice: {
    fontSize:  isIpad ? 20 : 14,
    marginHorizontal: 5,
    color: "#FFF",
    marginTop: 3,
  },
  buttonContainer: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageButton: {
    padding: 10,
    backgroundColor: '#333', // Example color
    borderRadius: 5,
    margin: 10,
    alignSelf: 'center', // Center button in the screen
  },
  noImageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '000000', // Set a background color if needed
  },
  bannerImage: {
    width: '100%',
    height: 45, // Set the height of the banner
    resizeMode: 'contain', // or 'cover' depending on your preference
  },
  menuIcon: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 5, // Adjust top for iOS status bar
    left: 10,
    zIndex: 100,
  },
});

export default Mainmenu;
