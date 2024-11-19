import React from 'react';
import { Button } from "@/components/ui/button"


const Header = ({ isAuthenticated, onLogout, userName }) => {
  return (
    <header className="bg-red-600 text-white p-6 flex justify-between items-center">
      <h1 className="text-4xl font-bold">Restaurante El Sabor de Berny</h1>
      
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <span className="text-lg">Hola, {userName}!</span> 
          <Button variant="outline" onClick={onLogout}>Cerrar Sesión</Button>
        
        </div>
      )}
    </header>
  );
};

export default Header;
