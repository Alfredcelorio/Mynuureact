import React, { useEffect, useState, useContext } from "react";
import {
  Dimensions,
  Platform,
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useRoute } from "@react-navigation/native";
import { getItemByMultipleCriteria } from "../../services/conx/settings";
import { AuthContext } from "../../context/context";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const isIpad =
  Platform.OS === "ios" &&
  ((windowWidth >= 768 && windowHeight >= 1024) || // iPad Pro 12.9" or similar
    (windowWidth >= 768 && windowHeight >= 768));

Animatable.initializeRegistryWithDefinitions({
  typingFade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const TypingText = Animatable.createAnimatableComponent(Text);

const Item = ({ productData, id }) => {
  const { user, routerName, setRouterName, productDataUpdate } =
    useContext(AuthContext);
  const route = useRoute();
  const [animationDelay, setAnimationDelay] = useState(0);
  const [abv, setAbv] = useState();
  const [body, setBody] = useState();
  const [brand, setBrand] = useState();
  const [countryState, setCountryState] = useState();
  const [region, setRegion] = useState();
  const [sku, setSku] = useState();
  const [taste, setTaste] = useState();
  const [type, setType] = useState();
  const [varietal, setVarietal] = useState();
  const [servings, setServings] = useState();
  const [purchaseCost, setPurchaseCost] = useState();
  const [name, setName] = useState(productDataUpdate?.name);
  const [price, setPrice] = useState(productDataUpdate?.price);
  console.log('PRice: ', productDataUpdate?.price)
  const [img, setImg] = useState(productDataUpdate?.image);

  const filteredProductData = {
    ABV:
      productDataUpdate?.abv !== undefined
        ? productDataUpdate.abv
        : productData?.abv || "",
    Body:
      productDataUpdate?.body !== undefined
        ? productDataUpdate.body
        : productData?.body || "",
    Brand:
      productDataUpdate?.brand !== undefined
        ? productDataUpdate.brand
        : productData?.brand || "",
    CountryState:
      productDataUpdate?.countryState !== undefined
        ? productDataUpdate.countryState
        : productData?.countryState || "",
    Region:
      productDataUpdate?.region !== undefined
        ? productDataUpdate.region
        : productData?.region || "",
    Sku:
      productDataUpdate?.sku !== undefined
        ? productDataUpdate.sku
        : productData?.sku || "",
    Taste:
      productDataUpdate?.taste !== undefined
        ? productDataUpdate.taste
        : productData?.taste || "",
    Type:
      productDataUpdate?.type !== undefined
        ? productDataUpdate.type
        : productData?.type || "",
    Varietal:
      productDataUpdate?.varietal !== undefined
        ? productDataUpdate.varietal
        : productData?.varietal || "",
    Servings:
      productDataUpdate?.servings !== undefined
        ? productDataUpdate.servings
        : productData?.servings || "",
    PurchaseCost:
      productDataUpdate?.purchaseCost !== undefined
        ? productDataUpdate.purchaseCost
        : productData?.purchaseCost || "",
  };

  const fetchData = async () => {
    try {
      routerName.map((product) =>
        product === route.name ? route.name : product
      );

      const fetch = await getItemByMultipleCriteria(
        "products",
        productData?.categoryId,
        productData?.menuId,
        productData?.restaurantId,
        id
      );

      console.log("ENTER");

      setAbv(fetch?.abv);
      setBody(fetch?.body);
      setBrand(fetch?.brand);
      setCountryState(fetch?.countryState);
      setRegion(fetch?.region);
      setSku(fetch?.sku);
      setTaste(fetch?.taste);
      setType(fetch?.type);
      setVarietal(fetch?.varietal);
      setServings(fetch?.servings);
      setPurchaseCost(fetch?.purchaseCost);
      setName(fetch?.name);
      setPrice(fetch?.price);
      setImg(fetch?.image);

      console.log("FINISH");
    } catch (err) {}
  };

  useEffect(() => {
    // Set a delay before the animation starts (for a typing effect)
    const delay = 1000; // You can adjust this delay according to your preference
    setAnimationDelay(delay);

    fetchData();
  }, [route.name]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <TypingText
            animation="typingFade"
            duration={800}
            delay={animationDelay}
            style={styles.title}
          >
            {productDataUpdate?.name || productData.name}
          </TypingText>
          <Image
            source={{ uri: productDataUpdate?.image || productData.image }}
            style={styles.image}
            resizeMode="contain"
          />
          <TypingText
            animation="typingFade"
            duration={1000}
            delay={animationDelay + 600}
            style={styles.description}
          >
            {productData?.description}
          </TypingText>
          <View style={styles.priceContainer}>
            <TypingText
              animation="typingFade"
              duration={4000}
              delay={animationDelay + 900}
              style={styles.price}
            >
              {productDataUpdate?.price || productData?.price}
            </TypingText>
            <View style={styles.additionalInfoContainer}>
              {Object.entries(filteredProductData).map(([key, value]) => (
                <View style={styles.additionalInfoItem} key={key}>
                  <Text style={styles.additionalInfoLabel}>{key}</Text>
                  <Text style={styles.additionalInfoValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 320,
    resizeMode: "contain",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
    marginTop: 20,
    textAlign: "center",
  },
  price: {
    fontSize: 19,
    fontWeight: "400",
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
  additionalInfoContainer: {
    width: "100%",
    marginTop: 20,
    borderWidth: 2,
    borderColor: "white", // bold border color
    padding: 14,
  },

  additionalInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  additionalInfoLabel: {
    fontFamily: "Metropolis-Bold",
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  additionalInfoValue: {
    fontFamily: "Metropolis-Regular",
    fontSize: 16,
    fontWeight: "400",
    color: "white",
  },
  goBackButton: {
    position: "absolute",
    top: isIpad ? 40 : 2,
    right: 15,
    left: 15,
    zIndex: 100,
    padding: 10,
  },
  goBackText: {
    fontSize: 30,
    fontWeight: "500",
    color: "white",
  },
});

export default Item;
