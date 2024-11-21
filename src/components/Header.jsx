import React from 'react';
import { Button } from "@/components/ui/button";

const Header = ({ isAuthenticated, onLogout, userName }) => {
  return (
    <header className="bg-red-600 text-white p-6 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold tracking-wide">
        Restaurante El Sabor de Berny
      </h1>
      
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <span className="text-base font-medium">
            Hola, <span className="font-semibold">{userName}</span>!
          </span>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="border-white text-white hover:bg-white hover:text-red-600 transition duration-200"
          >
            Cerrar Sesión
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;

