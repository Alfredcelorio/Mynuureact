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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { menusApi, categoriesApi, productsApi } from "../config/api/product";
import { restaurantApi } from "../config/api/auth";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const Product = ({
  productData,
  image,
  title,
  description,
  price,
  navigation,
}) => {
  
  console.log("FILTRO: ", productData);
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
  const [restaurant, setRestaurant] = useState({});
  const [menues, setMenues] = useState();
  const [categoryes, setCategoryes] = useState();
  const [productts, setProductts] = useState();
  const [menuChanged, setMenuChanged] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProductsByRestaurant = async () => {
    try {
      setIsLoading(true);
      const selectMenu = await AsyncStorage.getItem("menuId");
      const restaurantId = await AsyncStorage.getItem("uid");
      const menu = await menusApi(restaurantId);
      setMenues(menu);
      const menuIds = menu.map((menu) => menu.id);
      const onlyOneMenus = selectMenu ? [selectMenu] : [menuIds?.[0]];

      const categories = await categoriesApi(restaurantId, onlyOneMenus);
      setCategoryes(categories);
      const categoriesId = categories.map(({ menuId, id }) => ({ menuId, id }));

      const products = await productsApi(restaurantId, categoriesId);
      setProductts(products);
      setData(products);
      setFilteredData(products);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (route.params && route.params.menuChanged) {
      setIsLoading(true);
      fetchProductsByRestaurant();
      setMenuChanged(false);
    }
  }, [route.params]);

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
    fetchProductsByRestaurant();
  }, []);

  useEffect(() => {
    const filtered = data.map((category) => {
      const filteredProducts = category.products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      
      if (filteredProducts.length > 0) {
        return { ...category, products: filteredProducts };
      }
      
      return null;
    });
  
    setFilteredData(filtered.filter(Boolean));
  }, [searchText, data]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#000", "white"]} style={styles.gradient}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={{
                uri: `${restaurant.logo}?random=${Math.random()}`,
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
            onPress={() => navigation.navigate("CustomDropdown")}
          >
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : (
          filteredData?.map((category, index) => (
            <View key={index}>
              <Text style={styles.categoryText}>{category.categoryName}</Text>
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
  );
};

const styles = StyleSheet.create({
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
