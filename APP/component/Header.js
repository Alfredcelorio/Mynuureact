import React from "react";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const isIpad =
  Platform.OS === "ios" &&
  ((windowWidth >= 768 && windowHeight >= 1024) ||
    (windowWidth >= 768 && windowHeight >= 768));

Animatable.initializeRegistryWithDefinitions({
  typingFade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackText}>← </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    content: {
      backgroundColor: 'black',
      height: 100,
      justifyContent: 'flex-end',
    },
    goBackButton: {
      alignSelf: 'flex-start',
      paddingBottom: 10,
      paddingLeft: 10,
    },
    goBackText: {
      fontSize: 30,
      fontWeight: "500",
      color: "white",
    },
  });

export default Header;
