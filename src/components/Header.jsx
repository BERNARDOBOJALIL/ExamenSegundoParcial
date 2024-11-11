import React from 'react';

const Header = ({ isAuthenticated, onLogout, userName }) => {
  return (
    <header className="bg-red-600 text-white p-6 flex justify-between items-center">
      <h1 className="text-4xl font-bold">Restaurante El Sabor de Berny</h1>
      
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <span className="text-lg">Hola, {userName}!</span> 
          <button 
            onClick={onLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
