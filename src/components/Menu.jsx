import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenu } from '../services/menuApi';

const Menu = ({ addToOrder, order,setOrder }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');
  const [expandedItemId, setExpandedItemId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMenu()
      .then((data) => {
        setMenuItems(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleAddToOrder = (item) => {
    const existingItem = order.find((orderItem) => orderItem.id === item.id);
    const updatedOrder = existingItem
      ? order.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity}
            : orderItem
        )
      : [...order, { ...item, quantity: 0 }];

    setOrder(updatedOrder);
    localStorage.setItem('order', JSON.stringify(updatedOrder));
    addToOrder(item);
  };

  const handleExpandItem = (id) => {
    setExpandedItemId((prevId) => (prevId === id ? null : id));
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const calculateTotal = () => {
    return order.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="h-full relative">
      <h2 className="text-2xl font-semibold mb-5 text-green-700">Nuestro Menú</h2>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="max-h-[720px] overflow-y-auto grid gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 bg-white shadow-lg rounded-lg border-2 border-green-500 transition-all duration-300 ${
                expandedItemId === item.id ? 'min-h-[400px]' : 'min-h-[150px]'
              } overflow-hidden cursor-pointer`}
              onClick={() => handleExpandItem(item.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-red-600">{item.name}</h3>
                  <p className="text-yellow-700 font-bold">${item.price}</p>
                  <p className="text-gray-600 italic">{item.description}</p>
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
                <div className="mt-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botón para ir al carrito */}
      {order.length > 0 && (
        <button
          onClick={goToCart}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-lg"
        >
          Ver Carrito - Total: ${calculateTotal()}
        </button>
      )}
    </div>
  );
};

export default Menu;
