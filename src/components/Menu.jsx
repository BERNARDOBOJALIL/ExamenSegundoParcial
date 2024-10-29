import React, { useState, useEffect } from 'react';
import { getMenu } from '../services/menuApi';

const Menu = ({ addToOrder }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');

  // Consumo de la API como nos enseñaste Rafa
  useEffect(() => {
    getMenu()
      .then((data) => {
        setMenuItems(data);
      })
      .catch((error) => {
        setError(error.message);
      });
    
  }, []); // Ester egg: Con la lista vacía se le dice al hook que debe ejecutarse solo una vez cuando el componente se renderiza. Lo que significa que ya no se va a volver a ejecutar

  return (
    <div className="h-full">
      <h2 className="text-2xl font-semibold mb-5 text-green-700">Nuestro Menú</h2>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        // Le tuve que modificar la altura y cosas que no sabía hacer muy bien con tailwind, las busqué :(
        <div className="max-h-[720px] overflow-y-auto grid gap-6">
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
