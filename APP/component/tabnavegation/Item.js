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
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useRoute } from "@react-navigation/native";
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
  const { productDataUpdate } =
    useContext(AuthContext);
  const route = useRoute();
  const [filteredProductData, setFilteredProductData] = useState({});
  const [animationDelay, setAnimationDelay] = useState(0);

  useEffect(() => {
    if (productDataUpdate && productDataUpdate.idItem === id) {
      setFilteredProductData(prevData => ({
        ...prevData,
        ABV: productDataUpdate.abv || "",
        Body: productDataUpdate.body || "",
        Brand: productDataUpdate.brand || "",
        CountryState: productDataUpdate.countryState || "",
        Region: productDataUpdate.region || "",
        Sku: productDataUpdate.sku || "",
        Taste: productDataUpdate.taste || "",
        Type: productDataUpdate.type || "",
        Varietal: productDataUpdate.varietal || "",
        Servings: productDataUpdate.servings || "",
        PurchaseCost: productDataUpdate.purchaseCost || "",
      }));
    } else {
      setFilteredProductData(prevData => ({
        ...prevData,
        ABV: productData.abv || "",
        Body: productData.body || "",
        Brand: productData.brand || "",
        CountryState: productData.countryState || "",
        Region: productData.region || "",
        Sku: productData.sku || "",
        Taste: productData.taste || "",
        Type: productData.type || "",
        Varietal: productData.varietal || "",
        Servings: productData.servings || "",
        PurchaseCost: productData.purchaseCost || "",
      }));
    }
  }, [productData, productDataUpdate, id]);

  useEffect(() => {
    // Set a delay before the animation starts (for a typing effect)
    const delay = 1000; // You can adjust this delay according to your preference
    setAnimationDelay(delay);
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
    fontSize: 30,
    fontWeight: "700",
    color: "white",
    marginTop: 20,
    textAlign: "center",
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
  additionalInfoContainer: {
    width: "100%",
    marginTop: 20,
    borderWidth: 2,
  
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
    marginTop: 3,
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
