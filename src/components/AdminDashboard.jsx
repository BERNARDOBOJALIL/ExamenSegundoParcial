import React from 'react';
import { FaClipboardList, FaChair, FaPlus, FaHistory } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ userName }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-yellow-100">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-12">
        Bienvenido, {userName}
      </h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-8">
        ¿Qué acción deseas realizar?
      </h2>
      <div className="grid grid-cols-2 gap-8">
        <button
          onClick={() => handleNavigation('/order-status')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex flex-col items-center justify-center w-56 h-56 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-110"
        >
          <FaClipboardList className="text-4xl mb-2" />
          <span className="text-lg text-center">Ver Estados de Pedidos</span>
        </button>
        <button
          onClick={() => handleNavigation('/tables')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex flex-col items-center justify-center w-56 h-56 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-110"
        >
          <FaChair className="text-4xl mb-2" />
          <span className="text-lg text-center">Gestionar Mesas</span>
        </button>
        <button
          onClick={() => handleNavigation('/add-product')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex flex-col items-center justify-center w-56 h-56 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-110"
        >
          <FaPlus className="text-4xl mb-2" />
          <span className="text-lg text-center">Agregar Producto</span>
        </button>
        <button
          onClick={() => handleNavigation('/admin-history')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex flex-col items-center justify-center w-56 h-56 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-110"
        >
          <FaHistory className="text-4xl mb-2" />
          <span className="text-lg text-center">Historial</span>
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
