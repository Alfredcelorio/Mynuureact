import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./APP/navigation/index";
import { AuthProvider } from "./APP/context/context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

export default function App() {
  useEffect(() => {
    async function loadAppResources() {
      try {
        await loadFonts();
      } catch (error) {
        throw new Error(error)
      } finally {
        setTimeout(() => {
          if (SplashScreen.hideAsync()) {
            SplashScreen.hideAsync();
          }
        }, 2000);
      }
    }

    loadAppResources();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

async function loadFonts() {
  await Font.loadAsync({
    "Metropolis-Black": require("./assets/fonts/Metropolis-Black.ttf"),
    "Metropolis-Bold": require("./assets/fonts/Metropolis-Bold.ttf"),
    "Metropolis-BoldItalic": require("./assets/fonts/Metropolis-BoldItalic.ttf"),
    "Metropolis-ExtraBold": require("./assets/fonts/Metropolis-ExtraBold.ttf"),
    "Metropolis-ExtraBoldItalic": require("./assets/fonts/Metropolis-ExtraBoldItalic.ttf"),
    "Metropolis-ExtraLight": require("./assets/fonts/Metropolis-ExtraLight.ttf"),
    "Metropolis-ExtraLightItalic": require("./assets/fonts/Metropolis-ExtraLightItalic.ttf"),
    "Metropolis-Light": require("./assets/fonts/Metropolis-Light.ttf"),
    "Metropolis-LightItalic": require("./assets/fonts/Metropolis-LightItalic.ttf"),
    "Metropolis-Medium": require("./assets/fonts/Metropolis-Medium.ttf"),
    "Metropolis-MediumItalic": require("./assets/fonts/Metropolis-MediumItalic.ttf"),
    "Metropolis-Regular": require("./assets/fonts/Metropolis-Regular.ttf"),
    "Metropolis-RegularItalic": require("./assets/fonts/Metropolis-RegularItalic.ttf"),
    "Metropolis-SemiBold": require("./assets/fonts/Metropolis-SemiBold.ttf"),
    "Metropolis-SemiBoldItalic": require("./assets/fonts/Metropolis-SemiBoldItalic.ttf"),
    "Metropolis-Thin": require("./assets/fonts/Metropolis-Thin.ttf"),
    "Metropolis-ThinItalic": require("./assets/fonts/Metropolis-ThinItalic.ttf"),
  });
}
