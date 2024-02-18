import React, { useEffect, useState, useMemo } from "react";
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
  Alert,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { restaurantApi } from "../config/api/auth";
import {
  getCategories,
  getProductsByMenu,
  updateItem,
} from "../services/productsList/products";
import { getMenus } from "../services/productsList/menus";
import { getRestaurant } from "../services/productsList/restaurant";
import Icon from "react-native-vector-icons/FontAwesome"; // Import FontAwesome or other icon sets
import greenCircle from "../../assets/greenCircle.png";
import redCircle from "../../assets/redCircle.png";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const Product = ({
  productData,
  image,
  title,
  description,
  price,
  status,
  id,
  setDeleteItem,
  searchValue,
  handleSearchChange,
  loadingStatus,
  setLoadingStatus,
  navigation,
}) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const update = async (title, id, status) => {
    setUpdateLoading(true);
    setLoadingStatus(true);
    try {
      await updateItem(id, { enabled: !status }, "products");
      setDeleteItem((prevDeleteItem) => !prevDeleteItem);

      if (searchValue) {
        handleSearchChange(searchValue);
      }
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Update full',
        });
        setUpdateLoading(false);
      }, 1001);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error when trying to update item status',
      });
      throw new Error(error);
    }
  };

  const handleIconPress = (title, id, status) => {
    if (status) {
      Alert.alert(
        `Deactivate item ${title}`,
        "If you deactivate this inventory item, it will disappear from your menu until you activate it again from the administrator.",
        [
          {
            text: "Back",
            onPress: () => console.log("Back pressed"),
            style: "cancel",
          },
          { text: "Continue", onPress: () => update(title, id, status) },
        ]
      );
    } else {
      Alert.alert(
        `Activate item ${title}`,
        "If you activate this inventory item, it will appear in your menu.",
        [
          {
            text: "Back",
            onPress: () => console.log("Back pressed"),
            style: "cancel",
          },
          { text: "Continue", onPress: () => update(title, id, status) },
        ]
      );
    }
  };

  return (
    <View style={styles.productContainer}>
      {productData.length !== 0 ? (
        <>
          <View style={styles.imageWrapper}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("item", { productData })
              }
            >
              <Image
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
            {!updateLoading ? (
              <TouchableOpacity
                style={styles.statusIconWrapper}
                onPress={() => handleIconPress(title, id, status)}
              >
                <Image
                  source={status ? greenCircle : redCircle}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.loadingStatus}>
                <ActivityIndicator size="large" color="#808080" />
              </View>
            )}
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
  Platform.OS === "ios" &&
  ((windowWidth >= 768 && windowHeight >= 1024) || // iPad Pro 12.9" or similar
    (windowWidth >= 768 && windowHeight >= 768));

const Mainmenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchProductsByCat, setSearchProductsByCat] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [productsByCat, setProductsByCat] = useState();
  const [selectedMenu, setSelectedMenu] = useState();
  const [categories, setCategories] = useState();
  const [menus, setMenus] = useState();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [deleteItem, setDeleteItem] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [page, setPage] = useState(1);

  const toggleMenuVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  const navigateToNoimagesmenu = () => {
    setIsModalVisible(true);
  };

  const handleMenuSelect = (menu) => {
    if (menu.id === selectedMenu) return setIsModalVisible(false);
    setIsLoading(true);
    setSelectedMenu(menu.id);
    setIsModalVisible(false);
    setSearchValue("");
    setSearchProductsByCat("");
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
  }, []);

  useEffect(() => {
    (async () => {
      const email = await AsyncStorage.getItem("email");
      try {
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
      } catch (err) {
        console.log("ERR:", err);
      }
    })();
  }, [route.name, productsByCat, deleteItem, productsByCat]);

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

        setTimeout(() => {
          setProductsByCat(productsByCategories);
        }, 500);
        setTimeout(() => {
          if (searchFilter !== "") {
            handleSearchChange(searchFilter);
          }
          setIsLoading(false);
          setLoadingStatus(false);
        }, 800);
      })();
    }
  }, [selectedMenu, deleteItem, loadingStatus, isLoading]);

  useEffect(() => {
    const initViewRestaurant = async () => {
      try {
        const email = await AsyncStorage.getItem("email");
        const uid = await AsyncStorage.getItem("uid");
        const fetchRest = await restaurantApi(email, uid);
        const [objetDestruct] = fetchRest;
        setRestaurant(objetDestruct);
      } catch (err) {
        throw new Error(err);
      }
    };

    initViewRestaurant();
    setIsLoading(true);
  }, []);

  const handleSearchEnd = () => {
    if (selectedMenu && categories) {
      (async () => {
        const data = await getProductsByMenu(selectedMenu);
        const productsByCategories = categories?.reduce((value, nextItem) => {
          const products = data?.filter(
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

        setProductsByCat((prevData) => [...prevData, ...productsByCategories]);
        setPage((prevPage) => prevPage + 1);
      })();
    }
  };

  const handleSearchChange = (target) => {
    if (target === "") {
      setSearchFilter(target);
      setSearchValue("");
      setSearchProductsByCat([]);
      return handleSearchEnd();
    }
    setSearchFilter(target);
    const value = target || searchFilter;
    const val = value.toLowerCase();

    setSearchValue(value.trimStart());

    if (value.trim() !== "".toLowerCase) {
      const data = productsByCat.reduce((acc, nextCat) => {
        const fp = nextCat.products.filter((item) =>
          item.name.toLowerCase().includes(val)
        );

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
        {/* <TouchableOpacity
          onPress={toggleMenuVisibility}
          style={styles.menuIcon}
        >
          <Icon name="bars" size={30} color="white" />
        </TouchableOpacity> */}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : searchProductsByCat.length !== 0 ? (
          <ScrollView>
            <LinearGradient colors={["#000", "white"]} style={styles.gradient}>
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={{
                      uri: `${restaurant?.logo}`,
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
                style={styles.buttonContainerChange}
              >
                <Text style={styles.noImageButtonText}>Change meu</Text>
              </TouchableOpacity>
              <TouchableOpacity
  onPress={() => navigation.navigate('Scaninventory')} // Use the correct screen name
  style={styles.buttonContainer}
>
  <Text style={styles.buttonText}>Scan Inventory</Text>
</TouchableOpacity>
              <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                placeholderTextColor="#aaa"
                value={searchValue}
                onChangeText={(e) => handleSearchChange(e)}
              />
            </View>
            {searchProductsByCat.map((category, index) => (
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
                      status={product.enabled}
                      deleteItem={deleteItem}
                      setDeleteItem={setDeleteItem}
                      id={product.id}
                      searchValue={searchValue}
                      handleSearchChange={handleSearchChange}
                      navigation={navigation}
                      loadingStatus={loadingStatus}
                      setLoadingStatus={setLoadingStatus}
                    />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <FlatList
            data={
              searchProductsByCat.length !== 0
                ? searchProductsByCat
                : productsByCat
            }
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleSearchEnd}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isLoading ? <ActivityIndicator /> : null
            }
            ListHeaderComponent={() => (
              <>
                <LinearGradient
                  colors={["#000", "white"]}
                  style={styles.gradient}
                >
                  <View style={styles.logoContainer}>
                    <View style={styles.logoWrapper}>
                      <Image
                        source={{
                          uri: `${restaurant?.logo}`,
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
                  <Text style={styles.headerText}>
                    {" "}
                    This is your inventory
                  </Text>

                  <View style={styles.buttonsContainer}>
  {/* Change Menu Button */}
  <TouchableOpacity
    onPress={navigateToNoimagesmenu}
    style={[styles.button, { marginRight: 8 }]} // Add marginRight for spacing between buttons
  >
    <Text style={styles.buttonText}>Change Menu</Text>
  </TouchableOpacity>

  {/* Scan Inventory Button */}
  <TouchableOpacity
  onPress={() => navigation.navigate('Scaninventory')} // Use the correct screen name
  style={styles.buttonContainer}
>
  <Text style={styles.buttonText}>Scan Inventory</Text>
</TouchableOpacity>
</View>
                  <TextInput
                    style={styles.searchBar}
                    placeholder="Search..."
                    placeholderTextColor="#aaa"
                    value={searchValue}
                    onChangeText={(e) => handleSearchChange(e)}
                  />
                </View>
              </>
            )}
            renderItem={({ item, index }) => (
              <View key={index}>
                <Text style={styles.categoryText}>{item.name}</Text>
                <View style={styles.productRow}>
                  {item.products?.map((product, i) => (
                    <Product
                      key={i}
                      productData={product}
                      image={product.image}
                      title={product.name}
                      price={product.price}
                      status={product.enabled}
                      deleteItem={deleteItem}
                      setDeleteItem={setDeleteItem}
                      id={product.id}
                      searchValue={searchValue}
                      handleSearchChange={handleSearchChange}
                      navigation={navigation}
                      loadingStatus={loadingStatus}
                      setLoadingStatus={setLoadingStatus}
                    />
                  ))}
                </View>
              </View>
            )}
          />
        )}

        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/fullaccezz-2756a.appspot.com/o/restaurants%2Fmynuu-logo.jpg?alt=media&token=1cc8633b-e0e4-45af-906b-0b1ff10ce090",
            }}
            style={styles.bannerImage}
          />
        </View>
      </SafeAreaView>
      <Toast setRef={(ref) => Toast.setRef(ref)} />

    </>
  );
};

const styles = StyleSheet.create({
  menuModalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
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
    height: 40,
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
  buttonContainerChange: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    alignItems: "center",
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
    height: isIpad ? 500 : 280,
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
    fontSize: isIpad ? 20 : 14,
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
    backgroundColor: "#333", // Example color
    borderRadius: 5,
    margin: 10,
    alignSelf: "center", // Center button in the screen
  },
  noImageButtonText: {
    color: "white",
    fontSize: 16,
  },
  bannerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "000000", // Set a background color if needed
  },

  menuIcon: {
    position: "absolute",
    top: Platform.OS === "ios" ? 44 : 45, // Adjust top for iOS status bar
    left: 10,
    zIndex: 100,
  },
  statusIconWrapper: {
    position: "absolute",
    top: 15,
    right: 5,
    padding: 10,
  },
  loadingStatus: {
    position: "absolute",
    top: 15,
    right: 5,
    padding: 10,
  },
  topBarButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10, // Adjust padding as necessary
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
 
    buttonsContainer: {
      flexDirection: 'row', // Aligns buttons horizontally
      justifyContent: 'center', // Aligns container to the right
      padding: 10, // Adjust padding as needed
    },
    button: {
      backgroundColor: '#000', // Button background color
      padding: 10,
      borderRadius: 5, // Rounded corners
      alignItems: 'center', // Center text horizontally
    },
    buttonText: {
      color: '#FFF', // Text color
    },

  
  
});

// add # of bottles/ servings lets
// clean guestProfile maybe use a template?
//invenotry screen? just like the screenshot from turo
export default Mainmenu;
