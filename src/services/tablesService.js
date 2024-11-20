import { collection, getDocs, query, where, doc, updateDoc, addDoc, deleteDoc, orderBy, getDoc } from "firebase/firestore"; 
import { db } from "./firebaseConfig";

const getTables = async () => {
  try {
    console.log('Attempting to fetch tables from Firestore...');

    
    const tablesCollection = collection(db, 'Tables');
    const tablesQuery = query(tablesCollection, orderBy('Table_number', 'asc')); 
    const snapshot = await getDocs(tablesQuery);

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


    const tableDoc = await getDoc(tableRef);
    if (tableDoc.exists()) {
      const currentState = tableDoc.data().State;

      const newState = !currentState;

      await updateDoc(tableRef, {
        State: newState,
      });

      console.log(`Table state updated to ${newState ? 'occupied' : 'available'}`);
    } else {
      console.error('Table document does not exist.');
    }
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

const createTable = async (tableNumber) => {
  try {
    console.log('Attempting to create a new table...');
    const tableNumberAsNumber = Number(tableNumber);

    if (isNaN(tableNumberAsNumber)) {
      console.error('Invalid table number:', tableNumber);
      return;
    }

    const tablesCollection = collection(db, 'Tables');
    const newTable = {
      Table_number: tableNumberAsNumber,
      State: false, 
    };

    const docRef = await addDoc(tablesCollection, newTable);
    console.log('New table created with ID:', docRef.id);
  } catch (error) {
    console.error('Error creating new table:', error);
  }
};

const deleteTable = async (tableId) => {
  try {
    console.log('Attempting to delete table...');
    const tableRef = doc(db, 'Tables', tableId);
    await deleteDoc(tableRef);
    console.log('Table deleted successfully:', tableId);
  } catch (error) {
    console.error('Error deleting table:', error);
  }
};

export { getTables, updateTableState, resetTableState, createTable, deleteTable };
