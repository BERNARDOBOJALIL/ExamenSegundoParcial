import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function getMenu() {
    try {
        const productsRef = collection(db, "Products");
        const querySnapshot = await getDocs(productsRef);
        const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().Name,
            price: doc.data().Price, 
            description: doc.data().Description,
            category: doc.data().Category,
            available: doc.data().Available,
            created: doc.data().Created.toDate(), 
            image: doc.data().Image,
        }));

        return products.filter(product => product.available);
        
    } catch (error) {
        throw error;
    }
            
}
export { getMenu };