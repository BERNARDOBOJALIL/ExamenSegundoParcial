import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const getTables = async () => {
  try {
    const tablesCollection = collection(db, "Tables");
    const tablesQuery = query(tablesCollection, orderBy("Table_number", "asc"));
    const snapshot = await getDocs(tablesQuery);

    if (snapshot.empty) {
      return [];
    }

    const tables = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return tables;
  } catch (error) {
    return [];
  }
};

const updateTableState = async (tableId) => {
  try {
    const tableRef = doc(db, "Tables", tableId);

    const tableDoc = await getDoc(tableRef);
    if (tableDoc.exists()) {
      const currentState = tableDoc.data().State;

      const newState = !currentState;

      await updateDoc(tableRef, {
        State: newState,
      });
    }
  } catch (error) {}
};

const resetTableState = async (tableNumber) => {
  try {
    const tableNumberAsNumber = Number(tableNumber);

    if (isNaN(tableNumberAsNumber)) {
      return;
    }

    const tablesCollection = collection(db, "Tables");
    const q = query(
      tablesCollection,
      where("Table_number", "==", tableNumberAsNumber)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return;
    }

    const tableRef = doc(db, "Tables", querySnapshot.docs[0].id);
    await updateDoc(tableRef, {
      State: false,
    });
  } catch (error) {}
};

const createTable = async (tableNumber) => {
  try {
    const tableNumberAsNumber = Number(tableNumber);

    if (isNaN(tableNumberAsNumber)) {
      return;
    }

    const tablesCollection = collection(db, "Tables");
    const newTable = {
      Table_number: tableNumberAsNumber,
      State: false,
    };

    const docRef = await addDoc(tablesCollection, newTable);
  } catch (error) {}
};

const deleteTable = async (tableId) => {
  try {
    const tableRef = doc(db, "Tables", tableId);
    await deleteDoc(tableRef);
  } catch (error) {}
};

export {
  getTables,
  updateTableState,
  resetTableState,
  createTable,
  deleteTable,
};
