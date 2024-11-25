import React, { useEffect, useState } from "react";
import { getOrders, setOrderToReady } from "../services/orderService";
import {
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaUtensils,
} from "react-icons/fa";

const OrderStatusAdmin = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let unsubscribe;

    const startRealTimeListener = () => {
      try {
        unsubscribe = getOrders(
          { sortBy: "timestamp", sortOrder: "desc" },
          (fetchedOrders) => {
            const filteredOrders = fetchedOrders.filter(
              (order) => order.state !== "Recibido"
            );
            setOrders(filteredOrders);
          }
        );
      } catch (error) {}
    };

    startRealTimeListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSetReady = async (orderId) => {
    try {
      await setOrderToReady(orderId);
    } catch (error) {}
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "En preparación":
        return "bg-yellow-200 border-yellow-600";
      case "Listo":
        return "bg-green-200 border-green-600";
      default:
        return "bg-white border-gray-300";
    }
  };

  return (
    <div className="mt-10 mb-10 px-4">
      <h2 className="text-3xl font-bold mb-5 flex items-center gap-2 mt-20">
        Órdenes activas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`p-6 shadow-lg rounded-lg border-4 flex flex-col justify-between h-full ${getStatusColor(
              order.state
            )}`}
          >
            <div>
              <div className="flex items-center">
                <p className="font-semibold text-lg">
                  ID de Orden:{" "}
                  <span className="font-normal text-blue-600">{order.id}</span>
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Fecha:{" "}
                {new Date(order.timestamp.seconds * 1000).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Cliente: {order.client || "No especificado"}
              </p>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 mr-2">Estado:</p>
                {order.state === "En preparación" && (
                  <FaClock className="text-yellow-600" />
                )}
                {order.state === "Listo" && (
                  <FaCheckCircle className="text-green-600" />
                )}
                <span className="font-semibold">{order.state}</span>
              </div>
              <p className="text-sm text-gray-500 flex items-center">
                <FaCreditCard className="mr-1" />
                Método de Pago: {order.payment}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <FaUtensils className="mr-1" />
                Mesa: {order.table_number || "No especificada"}
              </div>
              <h4 className="text-md font-semibold mt-2">Items:</h4>
              <div className="max-h-32 overflow-auto">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm mt-1"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-blue-700">
              <span>Total:</span>
              <span>${order.total}</span>
            </div>
            {order.state === "En preparación" && (
              <button
                onClick={() => handleSetReady(order.id)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 flex items-center justify-center space-x-2"
              >
                <FaCheckCircle />
                <span>Marcar como Listo</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusAdmin;
