import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

function getMenu(onDataChange, onError) {
  try {
    const productsRef = collection(db, "Products");

    const unsubscribe = onSnapshot(
      productsRef,
      (querySnapshot) => {
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().Name,
          price: doc.data().Price,
          description: doc.data().Description,
          category: doc.data().Category,
          available: doc.data().Available,
          created: doc.data().Created?.toDate(),
          image: doc.data().Image,
        }));

        onDataChange(products.filter((product) => product.available));
      },
      (error) => {
        onError(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    onError(error);
  }
}

export { getMenu };
