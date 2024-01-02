import { useContext } from 'react'
import "react-native-gesture-handler";
import { View, Text, Image } from "react-native";
import {
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
// pages
import Mainmenu from "../screens/Mainmenu";
import LoginScr from "../screens/LoginScr";
// context
import { AuthContext } from '../context/context';
// firebase
import { getAuth, signOut } from 'firebase/auth';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const { user, setCurrentUser } = useContext(AuthContext);
    const auth = getAuth();
  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <SafeAreaView>
            <View
              style={{
                height: 200,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderBottomColor: "#f4f4f4",
                borderBottomWidth: 1,
              }}
            >
              <Image
                source={{ uri: user?.photoURL }}
                style={{
                  height: 130,
                  width: 130,
                  borderRadius: 65,
                }}
              />
              <Text
                style={{
                  fontSize: 22,
                  marginVertical: 6,
                  fontWeight: "bold",
                  color: "#111",
                }}
              >
                {user?.displayName}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#111",
                }}
              >
                {user?.email}
              </Text>
            </View>
            <DrawerItemList {...props} />
          </SafeAreaView>
        );
      }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#fff",
          width: 250,
        },
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerLabelStyle: {
          color: "#111",
        },
      }}
    >
      <Drawer.Screen
        name="Mainmenu"
        options={{
          drawerLabel: "Menu",
          title: "Menu",
          drawerIcon: () => (
            <SimpleLineIcons name="home" size={20} color="#808080" />
          ),
        }}
        component={Mainmenu}
      />
      <Drawer.Screen
        name="Logout"
        component={LoginScr}
        listeners={{
          focus: async () => {
            setCurrentUser(null);
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem("uid");
            await AsyncStorage.removeItem("email");
            await signOut(auth);
          },
        }}
        options={{
          drawerLabel: "Logout",
          drawerIcon: () => (
            <MaterialCommunityIcons name="logout" size={20} color="#808080" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
