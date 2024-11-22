import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, setOrderToReceived } from '../services/orderService';

const UserHistory = ({ clientName }) => {
  const [ordersFromDB, setOrdersFromDB] = useState([]);
  const [storedClientName, setStoredClientName] = useState(localStorage.getItem('clientName') || clientName);
  const navigate = useNavigate();

  useEffect(() => {
    if (clientName) {
      localStorage.setItem('clientName', clientName);
      setStoredClientName(clientName);
    }
  }, [clientName]);

  useEffect(() => {
    let unsubscribe;

    const startRealTimeListener = () => {
      try {
        unsubscribe = getOrders(
          { clientName: storedClientName, sortBy: 'timestamp', sortOrder: 'desc' },
          (orders) => {
            setOrdersFromDB(orders);
          }
        );
      } catch (error) {
        console.error("Error setting up real-time listener for orders:", error);
      }
    };

    startRealTimeListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [storedClientName]);

  const handleStatusChange = async (orderId) => {
    try {
      await setOrderToReceived(orderId);
      console.log(`Orden ${orderId} marcada como Recibido`);
    } catch (error) {
      console.error(`Error al cambiar el estado de la orden ${orderId}:`, error);
    }
  };

  const getStatusColor = (state) => {
    switch (state) {
      case 'En preparación':
        return 'bg-yellow-200';
      case 'Listo':
        return 'bg-green-200';
      case 'Recibido':
        return 'bg-gray-300';
      default:
        return 'bg-white';
    }
  };

  const goBackToMenu = () => {
    navigate('/menu'); 
  };

  return (
    <div className="mt-20 mb-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">Historial</h2>
      <button
        onClick={goBackToMenu}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg mr-4 mb-4"
      >
        Regresar al Menú
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ordersFromDB.map((dbOrder) => (
          <div
            key={dbOrder.id}
            className={`p-4 shadow-lg rounded-lg border border-blue-300 flex flex-col justify-between h-full ${getStatusColor(dbOrder.state)}`}
          >
            <div>
              <p className="font-semibold">ID de Orden: <span className="font-normal">{dbOrder.id}</span></p>
              <p className="text-sm text-gray-500 mt-1">Fecha: {new Date(dbOrder.timestamp.seconds * 1000).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Cliente: {dbOrder.client || 'No especificado'}</p>
              <p className="text-sm text-gray-500">Estado: <span className="font-semibold">{dbOrder.state}</span></p>
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
            {dbOrder.state === 'Listo' && (
              <button
                onClick={() => handleStatusChange(dbOrder.id)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Marcar como Recibido
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistory;
