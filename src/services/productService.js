// services/productService.js
import { db, storage } from './firebaseConfig';
import { addDoc, setDoc, doc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export const uploadImage = async (imageFile) => {
  const storageRef = ref(storage, `images/${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};


export const registerProduct = async (product) => {
  const productCollection = collection(db, 'Products');
  await addDoc(productCollection, product);
};


export const updateProduct = async (id, updatedProduct) => {
    try {
      const productDoc = doc(db, 'Products', id);
      await setDoc(productDoc, updatedProduct);
      console.log("Documento actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      throw error;
    }
  };
