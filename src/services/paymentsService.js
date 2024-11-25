import {
  collection,
  setDoc,
  getDoc,
  doc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const createCard = async (card, uid) => {
  try {
    const data = { card: card };
    const docRef = doc(db, "Cards", uid);
    await setDoc(docRef, data);
  } catch (e) {}
};

const getUID = async (email) => {
  try {
    const usersCollection = collection(db, "Users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.id;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const getCard = async (uid) => {
  try {
    const docRef = doc(db, "Cards", uid);
    const result = await getDoc(docRef);
    if (result.exists()) {
      return result.data();
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export { createCard, getCard, getUID };
