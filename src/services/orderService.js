import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Read all orders
const getOrders = async ({ startDate, endDate, startTime, endTime, sortBy, sortOrder, clientName } = {}) => {
    try {
        
        let ordersQuery = collection(db, "Orders");

        const constraints = [];

        
        if (clientName) {
            constraints.push(where("client", "==", clientName));
        }

        
        if (startDate) {
            const startDateTime = new Date(`${startDate}T${startTime || '00:00'}:00`);
            const startTimestamp = Timestamp.fromDate(startDateTime);
            console.log("Start Date and Time:", startDate, startTime);
            console.log("Converted Start Timestamp:", startTimestamp);
            constraints.push(where("timestamp", ">=", startTimestamp));
        }

        
        if (endDate) {
            const endDateTime = new Date(`${endDate}T${endTime || '23:59'}:59`);
            const endTimestamp = Timestamp.fromDate(endDateTime);
            console.log("End Date and Time:", endDate, endTime);
            console.log("Converted End Timestamp:", endTimestamp);
            constraints.push(where("timestamp", "<=", endTimestamp));
        }

        
        console.log("Sort By:", sortBy);
        console.log("Sort Order:", sortOrder);

        
        constraints.push(orderBy(sortBy === 'total' ? 'total' : 'timestamp', sortOrder));

        
        console.log("Constraints applied:", constraints);
        const querySnapshot = await getDocs(query(ordersQuery, ...constraints));
        
        const dataList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("Fetched Orders:", dataList);
        return dataList;
    } catch (error) {
        console.error("Error fetching orders with filters:", error);
        throw error;
    }
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

