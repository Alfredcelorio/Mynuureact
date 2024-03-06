import {
    query,
    where,
    getDocs,
    orderBy,
    collection,
    updateDoc,
    doc,
  } from "firebase/firestore/lite";
  import { db } from "../../utils/firebase";

  const getArrayFromCollection = (collection) => collection.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  export const getItemsByConditionGuest = async (value, collections, param) => {
    const colRef = collection(db, collections);
    const result = await getDocs(query(colRef, where(param, '==', value)));
    return getArrayFromCollection(result);
  };

  export const getItemsByConditionGuestAdmin = async (value, collections, param) => {
    const colRef = collection(db, collections);
    const result = await getDocs(query(colRef, where(param, '==', value)));
    const data = getArrayFromCollection(result);
    return data?.sort((a, b) => b?.lastVisit - a?.lastVisit);
  };