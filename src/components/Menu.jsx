import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMenu } from "../services/menuApi";
import TableSelector from "./TablesSelector";
import { Skeleton } from "./ui/skeleton";
import { FaChair, FaHistory } from "react-icons/fa";

const SkeletonMenu = () => {
  const skeletonsCount = Math.ceil(window.innerHeight / 100);

  return (
    <div className="space-y-4">
      {[...Array(skeletonsCount)].map((_, index) => (
        <div
          key={index}
          className="rounded-lg p-4 shadow-md border border-green-300"
        >
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-2" />
        </div>
      ))}
    </div>
  );
};

const Menu = ({
  order,
  setOrder,
  selectedTable,
  setSelectedTable,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [showInitialButtons, setShowInitialButtons] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTable = localStorage.getItem("selectedTable");
    if (savedTable) {
      setSelectedTable(savedTable);
      setShowInitialButtons(false);
    }
  }, [setSelectedTable]);

  const handleSelectTable = (tableNumber) => {
    setSelectedTable(tableNumber);
    localStorage.setItem("selectedTable", tableNumber);
    setShowInitialButtons(false);
  };

  const goToHistory = () => {
    navigate("/history");
  };

  const handleAddToOrder = (item) => {
    const existingItem = order.find((orderItem) => orderItem.id === item.id);
    const updatedOrder = existingItem
      ? order.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      : [...order, { ...item, quantity: 1 }];

    setOrder(updatedOrder);
  };

  useEffect(() => {
    const unsubscribe = getMenu(
      (data) => {
        setMenuItems(data);
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  if (showInitialButtons) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-yellow-100">
        <h2 className="text-3xl font-bold text-green-700 mb-12">
          ¿Qué quieres hacer hoy?
        </h2>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex flex-col items-center justify-center w-56 h-56 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-110 mb-6 p-4"
          onClick={() => setShowInitialButtons(false)}
        >
          <FaChair className="text-4xl mb-2" />
          <span className="text-lg">Seleccionar Mesa</span>
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex flex-col items-center justify-center w-56 h-56 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-110 p-4"
          onClick={goToHistory}
        >
          <FaHistory className="text-4xl mb-2" />
          <span className="text-lg">Ver Historial</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      {!selectedTable ? (
        <TableSelector onTableSelect={handleSelectTable} />
      ) : (
        <div className="h-full relative">
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : isLoading ? (
            <SkeletonMenu />
          ) : (
            <div className="mt-16 max-h-[720px] overflow-y-auto space-y-4">
              <h2 className="text-2xl font-semibold text-green-700">
                Nuestro Menú
              </h2>
              {categories.map((category) => (
                <div
                  key={category}
                  className="bg-white shadow-lg rounded-lg border-2 border-green-500 p-4"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category ? null : category
                      )
                    }
                  >
                    <h3 className="text-xl font-semibold text-green-700">
                      {category}
                    </h3>
                    <span className="text-xl">
                      {expandedCategory === category ? "▲" : "▼"}
                    </span>
                  </div>
                  {expandedCategory === category && (
                    <div className="mt-4 space-y-4">
                      {menuItems
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 bg-gray-100 shadow-lg rounded-lg border-2 border-gray-300 transition-all duration-300 ${
                              expandedItemId === item.id
                                ? "min-h-[400px]"
                                : "min-h-[150px]"
                            } overflow-hidden cursor-pointer`}
                            onClick={() =>
                              setExpandedItemId(
                                expandedItemId === item.id ? null : item.id
                              )
                            }
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-lg font-semibold text-red-600">
                                  {item.name}
                                </h4>
                                <p className="text-yellow-700 font-bold">
                                  ${item.price}
                                </p>
                                <p className="text-gray-600 italic">
                                  {item.description}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToOrder(item);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                              >
                                Agregar
                              </button>
                            </div>
                            {expandedItemId === item.id && (
                              <div className="mt-4 flex justify-center items-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-2/3 h-auto rounded-lg object-cover"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {order.length > 0 && (
            <button
              onClick={() => navigate("/cart")}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-lg"
            >
              Ver Carrito - Total: $
              {order.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;
