/* eslint-disable import/no-unresolved */
import React, { useContext, createContext } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { firebaseConfig } from "../utils/firebase";
import { getStorage } from "firebase/storage";
import { getAuth, setPersistence, getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


let firebaseApp;

if (firebase.apps.length === 0) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const storage = getStorage(firebaseApp);

const firebaseContext = createContext();
export function ProviderFirebaseAuth({ children }) {
  const auth = useFirebaseAuth();
  return (
    <firebaseContext.Provider value={auth}>{children}</firebaseContext.Provider>
  );
}
export const useFirebase = () => useContext(firebaseContext);

function useFirebaseAuth() {
  // all function below
  return {
    db,
    storage,
  };
}

ProviderFirebaseAuth.propTypes = {
  children: PropTypes.node,
};
