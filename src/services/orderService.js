import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Read all orders
const getOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "Orders"));
    const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    console.log(dataList);
    return dataList;
};

// Add a new order
const addOrder = async (order) => {
    try {
        const docRef = await addDoc(collection(db, "Orders"), order);
        console.log("Orden agregada con ID:", docRef.id);
        return docRef.id; 
    } catch (e) {
        console.error("Error agregando la orden:", e);
        throw e; 
    }
};

export { getOrders, addOrder };

