import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";  // Asegúrate de importar 'query'
import { db } from "./firebaseConfig";

// Función para obtener las mesas
const getTables = async () => {
  try {
    console.log('Attempting to fetch tables from Firestore...');
    
    const tablesCollection = collection(db, 'Tables');
    const snapshot = await getDocs(tablesCollection);

    if (snapshot.empty) {
      console.log('No tables found in Firestore.');
      return [];
    }

    console.log('Snapshot received. Mapping data...');
    const tables = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Tables fetched successfully:', tables);
    return tables;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
};


const updateTableState = async (tableId) => {
  try {
    console.log('Attempting to update table state...');
    
    const tableRef = doc(db, 'Tables', tableId); 
    await updateDoc(tableRef, {
      State: true,  
    });

    console.log('Table state updated to occupied');
  } catch (error) {
    console.error('Error updating table state:', error);
  }
};


const resetTableState = async (tableNumber) => {
    try {
      console.log('Attempting to reset table state...');
  
      
      const tableNumberAsNumber = Number(tableNumber);
  
      
      if (isNaN(tableNumberAsNumber)) {
        console.error('Invalid table number:', tableNumber);
        return;  
      }
  
      
      const tablesCollection = collection(db, 'Tables');
      const q = query(tablesCollection, where("Table_number", "==", tableNumberAsNumber));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log('No matching table found.');
        return;
      }
  
      
      const tableRef = doc(db, 'Tables', querySnapshot.docs[0].id);  
  
      await updateDoc(tableRef, {
        State: false,  
      });
  
      console.log('Table state updated to unoccupied');
    } catch (error) {
      console.error('Error resetting table state:', error);
    }
  };
  

export { getTables, updateTableState, resetTableState };
