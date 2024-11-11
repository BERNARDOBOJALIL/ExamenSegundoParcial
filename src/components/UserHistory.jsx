import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/orderService';

const UserHistory = ({ clientName }) => {
  const [ordersFromDB, setOrdersFromDB] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrders({ clientName });
        setOrdersFromDB(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [clientName]);

  return (
    <div className="mt-10 mb-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">Historial</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ordersFromDB.map((dbOrder) => (
          <div 
            key={dbOrder.id} 
            className="bg-white p-4 shadow-lg rounded-lg border border-blue-300 flex flex-col justify-between h-full"
          >
            <div>
              <p className="font-semibold">ID de Orden: <span className="font-normal">{dbOrder.id}</span></p>
              <p className="text-sm text-gray-500 mt-1">Fecha: {new Date(dbOrder.timestamp.seconds * 1000).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Cliente: {dbOrder.client || 'No especificado'}</p>
              <p className="text-sm text-gray-500">Método de Pago: {dbOrder.payment}</p>
              <h4 className="text-md font-semibold mt-2">Items:</h4>
              <div className="max-h-32 overflow-auto">
                {dbOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm mt-1">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-blue-700">
              <span>Total:</span>
              <span>${dbOrder.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;
