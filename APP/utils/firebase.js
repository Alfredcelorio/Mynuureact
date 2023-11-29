import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: 'AIzaSyDwgsxUPOO1Vsq6aoLTfRgUD-jWQGr67-s',
  authDomain: 'mn-mynuu.firebaseapp.com',
  databaseURL: 'https://fullaccezz-2756a-default-rtdb.firebaseio.com',
  projectId: 'fullaccezz-2756a',
  storageBucket: 'fullaccezz-2756a.appspot.com',
  messagingSenderId: '286050939937',
  appId: '1:286050939937:web:22cf7fca8275c9f14c9f60',
  measurementId: 'G-NSFRXJG38D',
  appVerificationDisabledForTesting: true,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
