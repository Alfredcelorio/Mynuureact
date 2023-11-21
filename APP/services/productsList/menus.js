import {
  query,
  where,
  getDocs,
  orderBy,
  collection,
} from "firebase/firestore/lite";
import { db } from "../../utils/firebase";

export const getMenus = async (restaurantId) => {
  try {
    const docs = query(
      collection(db, "menus"),
      where("restaurantId", "==", restaurantId),
      orderBy("position", "asc")
    );
    const menuDocs = await getDocs(docs);
    const data = menuDocs.docs?.map((docum) => ({
      id: docum?.id,
      ...docum.data(),
    }));
    if (data.length) return data.filter((item) => item?.status === true);

    return null;
  } catch (error) {
    return null;
  }
};
