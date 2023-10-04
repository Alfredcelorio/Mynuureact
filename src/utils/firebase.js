import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
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

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);
export const auth = getAuth();