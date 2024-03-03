import React, { useState, useEffect, useContext } from "react";
import { NativeBaseProvider } from 'native-base';
import { Box, Input, FormControl, Button  } from 'native-base';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
  const { user, routerName, setRouterName, setProductDataUpdate } = useContext(AuthContext);
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
        idItem: id,
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
        position: productData?.position || productData?.positionInCategory,
        purchaseCost: purchaseCost || productData?.purchaseCost || '',
        servings: servings || productData?.servings || '',
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
        console.log('POsition: ', logObjetUpdate)
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

        console.log('POsition: ', logObjetUpdate)
        await updateItem(logRestaurant[0]?.id, logObjetUpdate, "log");
      }

      await updateItem(id, obj, "products");

      setProductDataUpdate(obj);
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
    <NativeBaseProvider>
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {submitLoading ? (
            <ActivityIndicator size="large" color="#808080" />
          ) : (
            <Box alignItems="center" w="100%" px="2.5%">
            <Button onPress={onFinish} size="lg" w="95%">
              Save
            </Button>
          </Box>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FormControl>
        
         <Box style={styles.settingItem}>
         <FormControl.Label>Item name</FormControl.Label>
            <Input
               size="lg"
               placeholder="Enter item name"
               w="95%"
               value={itemName}
               onChangeText={(text) => setItemName(text)}
                 _input={{
                      color: 'blueGray.400',
                   }}
                   _light={{
                    _placeholder: { color: 'blueGray.400' },
                          }}
                    _dark={{
                   _placeholder: { color: 'blueGray.50' },
                     }}
                    />
                    </Box>
                 </FormControl>
                 <FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Price</FormControl.Label>
    <Input
      size="lg"
      placeholder="Enter price"
      w="95%"
      keyboardType="numeric"
      value={price}
      onChangeText={setPrice}
      _input={{ color: 'blueGray.400' }}
      _light={{ _placeholder: { color: 'blueGray.400' } }}
      _dark={{ _placeholder: { color: 'blueGray.50' } }}
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Purchase Cost</FormControl.Label>
    <Input
      size="lg"
      placeholder="Enter purchase cost"
      w="95%"
      keyboardType="numeric"
      value={purchaseCost}
      onChangeText={setPurchaseCost}
      _input={{ color: 'blueGray.400' }}
      _light={{ _placeholder: { color: 'blueGray.400' } }}
      _dark={{ _placeholder: { color: 'blueGray.50' } }}
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Servings</FormControl.Label>
    <Input
      size="lg"
      placeholder="Servings"
      w="95%"
      keyboardType="numeric"
      value={servings}
      onChangeText={setServings}
      _input={{ color: 'blueGray.400' }}
      _light={{ _placeholder: { color: 'blueGray.400' } }}
      _dark={{ _placeholder: { color: 'blueGray.50' } }}
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>ABV</FormControl.Label>
    <Input
      size="lg"
      placeholder="ABV"
      w="95%"
      value={abv}
      onChangeText={setAbv}
      _input={{ color: 'blueGray.400' }}
      _light={{ _placeholder: { color: 'blueGray.400' } }}
      _dark={{ _placeholder: { color: 'blueGray.50' } }}
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Body</FormControl.Label>
    <Input
      size="lg"
      placeholder="Body"
      w="95%"
      value={body}
      onChangeText={setBody}
      _input={{ color: 'blueGray.400' }}
      
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Brand</FormControl.Label>
    <Input
      size="lg"
      placeholder="Brand"
      w="95%"
      value={brand}
      onChangeText={setBrand}
      _input={{ color: 'blueGray.400' }}
 
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Country/State</FormControl.Label>
    <Input
      size="lg"
      placeholder="Country/State"
      w="95%"
      value={countryState}
      onChangeText={setCountryState}
      _input={{ color: 'blueGray.400' }}
      
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Region</FormControl.Label>
    <Input
      size="lg"
      placeholder="Region"
      w="95%"
      value={region}
      onChangeText={setRegion}
      _input={{ color: 'blueGray.400' }}
   
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>SKU</FormControl.Label>
    <Input
      size="lg"
      placeholder="SKU"
      w="95%"
      value={sku}
      onChangeText={setSku}
      _input={{ color: 'blueGray.400' }}
     
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Taste</FormControl.Label>
    <Input
      size="lg"
      placeholder="Taste"
      w="95%"
      value={taste}
      onChangeText={setTaste}
      _input={{ color: 'blueGray.400' }}
  
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Type</FormControl.Label>
    <Input
      size="lg"
      placeholder="Type"
      w="95%"
      value={type}
      onChangeText={setType}
      _input={{ color: 'blueGray.400' }}
     
    />
  </Box>
</FormControl>

<FormControl>
  <Box style={styles.settingItem}>
    <FormControl.Label>Varietal</FormControl.Label>
    <Input
      size="lg"
      placeholder="Varietal"
      w="95%"
      value={varietal}
      onChangeText={setVarietal}
      _input={{ color: 'blueGray.400' }}
     
    />
  </Box>
</FormControl> 
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
             <Box alignItems="center" w="100%" px="2.5%" mb="5">
           <Button
            onPress={pickImage}
             size="lg"
             variant="outline"
           w="95%"
             marginBottom="5" // Equivalent to 20 in NativeBase's default scale, you can adjust as needed
               >
                Upload image from gallery
             </Button>
               </Box>
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
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollContainer: {
    padding: 20,
  },
  settingItem: {
    justifyContent: "space-between",
    alignItems: "center",
   
   
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
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "black", // Match your theme
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
