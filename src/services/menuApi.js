import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Función para obtener los datos en tiempo real
function getMenu(onDataChange, onError) {
  try {
    const productsRef = collection(db, "Products");

    // Escucha cambios en tiempo real
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
          created: doc.data().Created?.toDate(), // Asegúrate de que Created exista
          image: doc.data().Image,
        }));

        // Filtra productos disponibles
        onDataChange(products.filter((product) => product.available));
      },
      (error) => {
        onError(error);
      }
    );

    // Devuelve la función para cancelar la suscripción
    return unsubscribe;
  } catch (error) {
    onError(error);
  }
}

export { getMenu };
