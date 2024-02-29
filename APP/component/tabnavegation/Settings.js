import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Timestamp } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/context";
import Toast from "react-native-toast-message";
import {
  uploadFile,
  updateItem,
  getItemsByConditionGuest,
  createItemCustom,
} from "../../services/conx/settings";

const SettingsScreen = ({ productData, id }) => {
  const route = useRoute();
  const { user, routerName, setRouterName } = useContext(AuthContext);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [availability, setAvailability] = useState(productData?.enabled);
  const [itemName, setItemName] = useState(productData?.name);
  const [price, setPrice] = useState(productData?.price);
  const [purchaseCost, setPurchaseCost] = useState(productData?.purchaseCost);
  const [abv, setAbv] = useState(productData?.abv);
  const [body, setBody] = useState(productData?.body);
  const [brand, setBrand] = useState(productData?.brand);
  const [countryState, setCountryState] = useState(productData?.countryState);
  const [region, setRegion] = useState(productData?.region);
  const [sku, setSku] = useState(productData?.sku);
  const [taste, setTaste] = useState(productData?.taste);
  const [type, setType] = useState(productData?.type);
  const [varietal, setVarietal] = useState(productData?.varietal);
  const [servings, setServings] = useState(productData?.servings);
  const imgProduct = productData?.image;
  const [image, setImage] = useState(null);
  const [nameImg, setNameImg] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need media library permissions to do this!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      getImageNameFromUrl(result?.assets?.[0]?.uri);
      setImage(result?.assets?.[0]?.uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      getImageNameFromUrl(result?.assets?.[0]?.uri);
      setImage(result?.assets?.[0]?.uri);
    }
  };

  const getImageNameFromUrl = (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const nameParts = filename.split(".");
    nameParts.pop();
    const name = nameParts.join(".");

    setNameImg(name);
  };

  const onFinish = async () => {
    try {
      setSubmitLoading(true);

      const time = Timestamp.fromDate(new Date()).toDate();
      const sendUrlImg = image && (await uploadFile(image));
      const obj = {
        name: itemName || productData?.name,
        description: productData?.description,
        price: price || productData?.price,
        categoryId: productData?.categoryId,
        image: image ? sendUrlImg : productData?.image,
        keyword: productData?.keyword,
        menuId: productData?.menuId,
        restaurantId: productData?.restaurantId,
        views: productData?.views,
        abv: abv || productData?.abv || "",
        body: body || productData?.body || "",
        brand: brand || productData?.brand || "",
        countryState: countryState || productData?.countryState || "",
        region: region || productData?.region || "",
        sku: sku || productData?.sku || "",
        taste: taste || productData?.taste || "",
        type: type || productData?.type || "",
        varietal: varietal || productData?.varietal || "",
        deleted: productData?.deleted,
        enabled:
          availability !== productData?.enabled
            ? availability
            : productData?.enabled,
        position: productData?.position,
        purchaseCost: purchaseCost || productData?.purchaseCost,
        servings: servings || productData?.servings,
        inventory: [{ ...productData?.inventory?.[0] }],
      };

      const logRestaurant = await getItemsByConditionGuest(
        productData?.restaurantId,
        "log",
        "idRestaurant"
      );

      const initialState = { ...productData };

      let oldObjLog = {};
      let editObjLog = {};

      for (let [key, value] of Object.entries(obj)) {
        if (key !== "inventory" && initialState[key] !== value) {
          oldObjLog[key] = initialState[key];
          editObjLog[key] = value;
        }
      }

      if (logRestaurant?.length === 0) {
        const logObjet = {
          idRestaurant: productData?.restaurantId,
          log: [
            {
              user: user?.displayName,
              email: user?.email,
              type: "edit product - mobile",
              time,
              nameItem: itemName || productData?.name,
              edit: editObjLog,
              oldValues: oldObjLog,
              idItem: id
            },
          ],
        };

        await createItemCustom(logObjet, "log");
      }

      if (logRestaurant?.length !== 0) {
        const logObjetUpdate = {
          idRestaurant: productData?.restaurantId,
          log: [
            ...(logRestaurant[0]?.log || ""),
            {
              user: user?.displayName,
              email: user?.email,
              type: "edit product - mobile",
              time,
              nameItem: itemName || productData?.name,
              edit: editObjLog,
              oldValues: oldObjLog,
              idItem: id
            },
          ],
        };

        await updateItem(logRestaurant[0]?.id, logObjetUpdate, "log");
      }

      await updateItem(id, obj, "products");
      const updatedProducts = routerName.map((product) =>
        product === route.name ? route.name : product
      );
      setRouterName(updatedProducts);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Access granted",
        position: "bottom",
      });
      setSubmitLoading(false);
    } catch (error) {
      console.log("ERROR: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Something seems to have gone wrong when trying to update the file: ${error.message}`,
        text2NumberOfLines: 5,
        position: "bottom",
      });
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {submitLoading ? (
            <ActivityIndicator size="large" color="#808080" />
          ) : (
            <TouchableOpacity onPress={onFinish} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Item Name</Text>
            <TextInput
              style={styles.settingInput}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Enter item name"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Price</Text>
            <TextInput
              style={styles.settingInput}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              keyboardType="numeric"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Purchase Cost</Text>
            <TextInput
              style={styles.settingInput}
              value={purchaseCost}
              onChangeText={setPurchaseCost}
              placeholder="Enter purchase cost"
              keyboardType="numeric"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Servings</Text>
            <TextInput
              style={styles.settingInput}
              value={servings}
              onChangeText={setServings}
              placeholder="Servings"
              keyboardType="numeric"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>ABV</Text>
            <TextInput
              style={styles.settingInput}
              value={abv}
              onChangeText={setAbv}
              placeholder="ABV"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Body</Text>
            <TextInput
              style={styles.settingInput}
              value={body}
              onChangeText={setBody}
              placeholder="Body"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Brand</Text>
            <TextInput
              style={styles.settingInput}
              value={brand}
              onChangeText={setBrand}
              placeholder="Brand"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Country/State</Text>
            <TextInput
              style={styles.settingInput}
              value={countryState}
              onChangeText={setCountryState}
              placeholder="Country/State"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Region</Text>
            <TextInput
              style={styles.settingInput}
              value={region}
              onChangeText={setRegion}
              placeholder="Region"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>SKU</Text>
            <TextInput
              style={styles.settingInput}
              value={sku}
              onChangeText={setSku}
              placeholder="SKU"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Taste</Text>
            <TextInput
              style={styles.settingInput}
              value={taste}
              onChangeText={setTaste}
              placeholder="Taste"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Type</Text>
            <TextInput
              style={styles.settingInput}
              value={type}
              onChangeText={setType}
              placeholder="Type"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Varietal</Text>
            <TextInput
              style={styles.settingInput}
              value={varietal}
              onChangeText={setVarietal}
              placeholder="Varietal"
              placeholderTextColor="#ccc"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Availability</Text>
            <Switch
              value={availability}
              onValueChange={setAvailability}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={availability ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Button
              style={{
                marginBottom: 20,
              }}
              title="Upload image from gallery"
              onPress={pickImage}
            />
            <TouchableOpacity onPress={takePhoto} style={styles.container}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200, marginTop: 20 }}
                />
              ) : (
                <Image
                  source={{ uri: imgProduct }}
                  style={{ width: 200, height: 200, marginTop: 20 }}
                />
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Toast setRef={(ref) => Toast.setRef(ref)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 10,
  },
  settingLabel: {
    fontSize: 18,
    color: "#fff",
  },
  settingInput: {
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    flex: 1,
    marginRight: 10,
    textAlign: "right",
    placeholderTextColor: "#ccc", // Ensures placeholder text is also visible
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "black", // Match your theme
  },
  saveButton: {
    backgroundColor: "black", // A green color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  changeImageButton: {
    backgroundColor: "blue", // Or any color that fits your design
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center", // Center the text inside the button
    marginTop: 20, // Add some margin at the top
  },
  changeImageButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  preview: {
    marginTop: 20,
  },
});

export default SettingsScreen;
