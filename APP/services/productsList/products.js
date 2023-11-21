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

export const getCategories = async (restaurantId) => {
  try {
    const docs = query(
      collection(db, "categories"),
      where("restaurantId", "==", restaurantId),
      orderBy("position", "asc")
    );
    const categoryDocs = await getDocs(docs);
    const data = categoryDocs.docs?.map((docum) => ({
      id: docum?.id,
      ...docum.data(),
    }));
    if (data.length) {
      return data;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const getFavProducts = async (restaurantId, likedProducts) => {
  const ids = likedProducts?.map((product) => `${product.id}`);
  try {
    const docs = query(
      collection(db, "products"),
      where("restaurantId", "==", restaurantId)
    );
    const productDocs = await getDocs(docs);
    const data = productDocs.docs?.map((docum) => ({
      id: docum?.id,
      ...docum.data(),
    }));
    const filteredData = data?.filter((product) => ids?.includes(product.id));
    return filteredData;
  } catch (error) {
    return null;
  }
};

export const getProductsByMenu = async (menuId) => {
  try {
    const docs = query(
      collection(db, "products"),
      where("deleted", "==", false),
      where("enabled", "==", true),
      where("menuId", "==", menuId)
    );
    const productDocs = await getDocs(docs);

    const data = productDocs.docs?.map((docum) => ({
      id: docum?.id,
      ...docum.data(),
    }));
    return data;
  } catch (error) {
    return null;
  }
};

export const updateLikedProducts = async (data) => {
  try {
    const docs = updateDoc(doc(collection(db, "guests"), data.id), data);
    if (docs) return docs;

    return null;
  } catch (error) {
    return null;
  }
};
