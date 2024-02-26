import { createContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getItemsByConditionGuest } from "../services/auth/auth";
import { auth } from "../utils/firebase";
import { useRoute } from "@react-navigation/native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [userID, setUserID] = useState();
  const [validationInv, setValidationInv] = useState();
  const [routerName, setRouterName] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const isLogin = await AsyncStorage.getItem("uid");
        const userEmail = await AsyncStorage.getItem("email");
        if (user && isLogin && userEmail) {
          setUser(user);
          setCurrentUser(user);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const userLogin = await AsyncStorage.getItem("uid");
      const userEmail = await AsyncStorage.getItem("email");

      if (userLogin && userEmail) {
        await AsyncStorage.removeItem("uid");
        await AsyncStorage.removeItem("email");
      }

      const responseLogin = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(responseLogin?.user);
      setUserID(responseLogin?.user?.uid);
      await AsyncStorage.setItem("token", responseLogin?.user?.uid);
      const admin = await getItemsByConditionGuest(
        email,
        "restaurants",
        "email"
      );
      setValidationInv(false);
      await AsyncStorage.setItem("uid", admin?.[0]?.id);
      await AsyncStorage.setItem("email", admin?.[0]?.email);
      setCurrentUser(admin?.[0]);
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, handleLogin, user, routerName, setRouterName }}
    >
      {children}
    </AuthContext.Provider>
  );
};
