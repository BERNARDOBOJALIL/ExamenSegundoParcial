import { db, storage } from "./firebaseConfig";
import { addDoc, setDoc, deleteDoc, doc, collection } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const uploadImage = async (imageFile) => {
  const storageRef = ref(storage, `images/${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const deleteImage = async (imageUrl) => {
  const storageRef = ref(storage, imageUrl);
  await deleteObject(storageRef);
};

export const registerProduct = async (product) => {
  const productCollection = collection(db, "Products");
  await addDoc(productCollection, product);
};

export const updateProduct = async (id, updatedProduct) => {
  const productDoc = doc(db, "Products", id);
  await setDoc(productDoc, updatedProduct);
};

export const deleteProduct = async (id) => {
  const productDoc = doc(db, "Products", id);
  await deleteDoc(productDoc);
};
