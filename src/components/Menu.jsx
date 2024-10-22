import React, { useState, useEffect } from 'react';

const Menu = ({ addToOrder }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');


  // Consumo de la API como nos enseñaste Rafa
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('https://api-menu-9b5g.onrender.com/menu'); 
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        setError('Error al cargar el menú');
      }
    };
    fetchMenuItems();
  }, []); // Ester egg:  Se le dice al hook que debe ejecutarse solo una vez cuando el componente se renderiza, significa que no se volverá a ejecutar después.

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-5 text-green-700">Nuestro Menú</h2>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg border-2 border-green-500">
              <div>
                <h3 className="text-lg font-semibold text-red-600">{item.name}</h3>
                <p className="text-yellow-700 font-bold">${item.price}</p>
                <p className="text-gray-600 italic">{item.description}</p>
              </div>
              <button
                onClick={() => addToOrder(item)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Agregar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
