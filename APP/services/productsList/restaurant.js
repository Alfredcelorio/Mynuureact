import { query, where, getDocs, collection } from "firebase/firestore/lite";
import { db } from "../../utils/firebase";

export const getRestaurant = async (shortUrl) => {
  try {
    const docs = query(
      collection(db, "restaurants"),
      where("email", "==", shortUrl)
    );
    const restaurantDoc = await getDocs(docs);

    const data = restaurantDoc.docs?.map((docum) => ({
      id: docum?.id,
      ...docum.data(),
    }));

    if (data.length) return data;

    return null;
  } catch (error) {
    return null;
  }
};
