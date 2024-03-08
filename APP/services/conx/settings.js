/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable no-return-await */
import {
    collection,
    getDocs,
    query,
    doc,
    getDoc,
    // addDoc,
    deleteDoc,
    updateDoc,
    where,
    orderBy,
    setDoc,
    addDoc,
    writeBatch,
  } from 'firebase/firestore/lite';
  import { deleteUser } from 'firebase/auth';
  import * as FileSystem from 'expo-file-system';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import 'react-native-get-random-values'; // No mover esta linea
  import { v4 } from 'uuid'; // No mover esta linea
  import { db, firebase } from '../../utils/firebase';
  import { decode } from 'react-native-base64';
  import { Buffer } from 'buffer';
  
  const storage = getStorage(firebase);
  
  // eslint-disable-next-line max-len, no-shadow
  const getArrayFromCollection = (collection) => collection.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
  // SEND IMG AND RETURN YUOR URL
  export const uploadFile = async (imageUri) => {
    try {
      const imageName = v4()
      const imageRef = ref(storage, `products/${imageName}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      return downloadURL;
    } catch (error) {
      throw error;
    }
  };

  // CREATE ACOUNT AND ID DB
export const createItem = async (obj, collections, id) => {
  const docRef = doc(db, collections, id);
  const data = await setDoc(docRef, obj, { merge: true });
  return data;
};

// CREATE NEW OBJECT IN COLLECTION
export const createItemCustom = async (obj, collections) => {
  try {
    const data = await addDoc(collection(db, collections), {
      ...obj,
    });
    return data.id;
  } catch (error) {
    console.log("Error: ", error);
    throw error
  }
};

// UPDATE
export const updateItem = async (id, obj, collections) => {
  try {
    const colRef = collection(db, collections);
    await updateDoc(doc(colRef, id), obj);
  } catch(err) {
    console.log('Err: ', err)
    throw err
  }
};

// READ
export const getItems = async (item) => {
  const colRef = collection(db, item);
  const result = await getDocs(query(colRef));
  return getArrayFromCollection(result);
};
// READ ID Collections
export const getItemsByIdCollection = async (value, collections, param) => {
  const colRef = collection(db, collections);
  const result = await getDocs(query(colRef));
  const arraysIdColletion = getArrayFromCollection(result);
};

// READ WITH WHERE
export const getItemsByCondition = async (value, collections, param) => {
  const colRef = collection(db, collections);
  const result = await getDocs(query(colRef, where(param, '==', value), orderBy('position', 'asc')));
  return getArrayFromCollection(result);
};

export const getItemsByConditionGuest = async (value, collections, param) => {
  const colRef = collection(db, collections);
  const result = await getDocs(query(colRef, where(param, '==', value)));
  return getArrayFromCollection(result);
};

export const getItemByMultipleCriteria = async (collectionName, categoryId, menuId, restaurantId, itemId) => {
  const colRef = collection(db, collectionName);
  
  const q = query(colRef, 
    where('categoryId', '==', categoryId),
    where('menuId', '==', menuId),
    where('restaurantId', '==', restaurantId),
  );
  
  const querySnapshot = await getDocs(q);

  let item = null;
  querySnapshot.forEach((doc) => {
    if (doc.id === itemId) {
      item = doc.data();
    }
  });

  return item;
};

export const getItemsByConditionGuestAdmin = async (value, collections, param) => {
  const colRef = collection(db, collections);
  const result = await getDocs(query(colRef, where(param, '==', value)));
  const data = getArrayFromCollection(result);
  return data?.sort((a, b) => b?.lastVisit - a?.lastVisit);
};

export const getItemsByConditionProduct = async (value, collections, param) => {
  const colRef = collection(db, collections);
  const result = await getDocs(query(colRef, where(param, '==', value), where('deleted', '==', false), orderBy('position', 'asc')));
  const data = getArrayFromCollection(result);
  return data?.sort((a, b) => a.positionInCategory - b.positionInCategory);
};

export const getItemById = async (id, collections) => {
  const colRef = collection(db, collections);
  const result = await getDoc(doc(colRef, id));
  return result.data();
};

export const getItemByIdProduct = async (id, collections) => {
  const colRef = collection(db, collections);
  const result = await getDoc(doc(colRef, id));
  return { ...result?.data(), id: result?.id };
};

// DELETE
export const deleteItem = async (id, collections) => {
  const colRef = collection(db, collections);
  await deleteDoc(doc(colRef, id));
};

export const deleteItemAndUser = async (id, collections) => {
  const colRef = collection(db, collections);
  await deleteDoc(doc(colRef, id));
  await deleteUser(id);
};

// INTEGRACION DE VALORES A UNA COLECCION
/* const batchSize = 500;

export const updateAllItems = async (item = 'products') => {
  const colRef = collection(db, item);
  const snapshot = await getDocs(query(colRef));

  const totalDocs = snapshot.size;
  const totalBatches = Math.ceil(totalDocs / batchSize);

  let processedDocs = 0;

  for (let i = 0; i < totalBatches; i++) {
    const batch = writeBatch(db);

    const batchDocs = snapshot.docs.slice(i * batchSize, (i + 1) * batchSize);

    batchDocs.forEach((docs) => {
      const docRef = docs.ref;
      batch.set(docRef, { ...docs.data(), position: 0 }, { merge: true });
    });

    await batch.commit();

    processedDocs += batchDocs.length;

    console.log(`Processed ${processedDocs} out of ${totalDocs} documents`);
  }
};
 */