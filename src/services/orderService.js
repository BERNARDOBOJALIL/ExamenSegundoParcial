import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

const AllOrders = ({ startDate, endDate, startTime, endTime, sortBy, sortOrder, clientName } = {}, callback) => {
    try {
        let ordersQuery = collection(db, "Orders");
        const constraints = [];

        if (clientName) {
            constraints.push(where("client", "==", clientName));
        }

        if (startDate) {
            const startDateTime = new Date(`${startDate}T${startTime || '00:00'}:00`);
            const startTimestamp = Timestamp.fromDate(startDateTime);
            constraints.push(where("timestamp", ">=", startTimestamp));
        }

        if (endDate) {
            const endDateTime = new Date(`${endDate}T${endTime || '23:59'}:59`);
            const endTimestamp = Timestamp.fromDate(endDateTime);
            constraints.push(where("timestamp", "<=", endTimestamp));
        }

        constraints.push(orderBy(sortBy === 'total' ? 'total' : 'timestamp', sortOrder));

        const q = query(ordersQuery, ...constraints);

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const dataList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log("Real-time Orders:", dataList);
            callback(dataList); 
        });

        
        return unsubscribe;
    } catch (error) {
        console.error("Error setting up real-time listener:", error);
        throw error;
    }
};


const getOrders = ({ clientName, sortBy = "timestamp", sortOrder = "asc" } = {}, callback) => {
    try {
        
        let ordersQuery = collection(db, "Orders");

        const constraints = [];

        
        if (clientName) {
            constraints.push(where("client", "==", clientName));
        }

        
        constraints.push(orderBy(sortBy, sortOrder));

        
        const finalQuery = query(ordersQuery, ...constraints);

        
        const unsubscribe = onSnapshot(finalQuery, (querySnapshot) => {
            const orders = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(orders); 
        });

        
        return unsubscribe;
    } catch (error) {
        console.error("Error setting up real-time listener for orders:", error);
        throw error;
    }
};



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


const setOrderToPreparation = async (orderId) => {
    try {
        const orderRef = doc(db, "Orders", orderId);
        await updateDoc(orderRef, { state: "En preparación" });
        console.log(`Orden ${orderId} actualizada a "En preparación"`);
    } catch (error) {
        console.error("Error actualizando el estado a 'En preparación':", error);
        throw error;
    }
};


const setOrderToReady = async (orderId) => {
    try {
        const orderRef = doc(db, "Orders", orderId);
        await updateDoc(orderRef, { state: "Listo" });
        console.log(`Orden ${orderId} actualizada a "Listo"`);
    } catch (error) {
        console.error("Error actualizando el estado a 'Listo':", error);
        throw error;
    }
};


const setOrderToReceived = async (orderId) => {
    try {
        const orderRef = doc(db, "Orders", orderId);
        await updateDoc(orderRef, { state: "Recibido" });
        console.log(`Orden ${orderId} actualizada a "Recibido"`);
    } catch (error) {
        console.error("Error actualizando el estado a 'Recibido':", error);
        throw error;
    }
};

export { getOrders, addOrder, setOrderToPreparation, setOrderToReady, setOrderToReceived, AllOrders };
