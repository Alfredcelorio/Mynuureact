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
import { menusApi, categoriesApi, productsApi } from "../config/api/product";
import { restaurantApi } from "../config/api/auth";
import {
  getCategories,
  getFavProducts,
  getProductsByMenu,
  updateLikedProducts,
} from "../services/productsList/products";
import { getMenus } from "../services/productsList/menus";
import { getRestaurant } from "../services/productsList/restaurant";

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
          <Text style={styles.productPrice}>{price}$</Text>
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

const isIpad =
  Platform.OS === "ios" && (windowWidth >= 768 || windowHeight >= 768);

const Mainmenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchText, setSearchText] = React.useState("");
  const [searchProductsByCat, setSearchProductsByCat] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [restaurant, setRestaurant] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsByCat, setProductsByCat] = useState();
  const [selectedMenu, setSelectedMenu] = useState();
  const [categories, setCategories] = useState();
  const [menus, setMenus] = useState();
  const [isModalVisible, setIsModalVisible] = useState(true);

  const toggleMenuVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu.id);
    setIsModalVisible(false);
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
        const selectMenuSave = await AsyncStorage.getItem("menuId");
        const restaurantId = await AsyncStorage.getItem("uid");
        console.log(selectedMenu)
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

  /* useEffect(() => {
    if (route.params && route.params.menuChanged) {
      setIsLoading(true);
      fetchProductsByRestaurant();
      setMenuChanged(false);
    }
  }, [route.params]); */

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
        <ScrollView>
          <View style={styles.topBar}>
            <Text style={styles.headerText}>
              Welcome to {restaurant?.restaurantName}
            </Text>
          </View>
          <View style={styles.searchBarContainer}>
            <Text style={styles.headerText}> This is your drink menu</Text>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={toggleMenuVisibility}
            >
              <Text style={styles.buttonText}>Change menu</Text>
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
                      description={product.description}
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
                      description={product.description}
                      price={product.price}
                      navigation={navigation}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  menuModalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  menuModalContent: {
    backgroundColor: "#000",
    padding: 20,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 30,
    zIndex: 100,
  },
  logoWrapper: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    marginBottom: 1,
  },
  searchBarContainer: {
    padding: 10,
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
    width: "45%",
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  productImage: {
    resizeMode: "contain",
    width: "100%",
    height: 280,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 5,
    color: "#FFF",
    marginTop: 10,
  },
  productDescription: {
    fontSize: 12,
    marginHorizontal: 5,
    color: "#FFF",
    marginTop: 3,
  },
  productPrice: {
    fontSize: 12,
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
});

export default Mainmenu;
