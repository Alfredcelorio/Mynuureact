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
      where("menuId", "==", menuId)
    );
    const productDocs = await getDocs(docs);

    const data = productDocs.docs?.map((docum) => ({
      id: docum?.id,
      ...docum.data(),
    }));

    const { quantities, totalMoneyBar } = extractQuantities(data);

    // console.log("Quantities:", quantities);
    // console.log("Total Money Bar:", totalMoneyBar);

    return { data, quantities, totalMoneyBar };
  } catch (error) {
    return { data: null, quantities: [], totalMoneyBar: 0 };
  }
};

const extractQuantities = (data) => {
  let quantities = [];
  let totalMoneyBar = 0;

  data.forEach((item) => {
    if (item.inventory && item.inventory.length > 0) {
      item.inventory.forEach((inventoryItem) => {
        const quantity = inventoryItem.quantity ? parseInt(inventoryItem.quantity) : 0;
        const purchaseCost = item.purchaseCost ? parseFloat(item.purchaseCost) : 0;
        const total = quantity * purchaseCost;
        quantities.push({ quantity, purchaseCost, total });
        totalMoneyBar += total;
      });
    }
  });

  return { quantities, totalMoneyBar };
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

export const updateItem = async (id, obj, collections) => {
  try {
    const docs = await updateDoc(doc(collection(db, collections), id), obj);
    return docs;
  } catch (error) {
    throw new Error(error);
  }
};
