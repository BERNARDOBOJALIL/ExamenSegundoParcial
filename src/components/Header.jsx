import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Header = ({ isAuthenticated, isAdmin, isEmployee, onLogout, userName }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-red-600 text-white shadow-lg z-50">
      <div className="p-4 flex justify-between items-center max-w-screen-xl mx-auto">
        <h1 className="text-xl font-bold tracking-wide">
          Restaurante El Sabor de Berny
        </h1>

        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none hover:text-gray-200 transition duration-200"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-4 bg-white text-red-600 shadow-lg rounded-lg w-64 p-4 animate-fade-in">
                <div className="border-b border-gray-200 mb-4">
                  <p className="text-sm font-medium">
                    Hola, <span className="font-semibold">{userName}</span>!
                  </p>
                </div>
                {!isAdmin && !isEmployee && ( 
                  <Link
                    to="/history"
                    className="block px-4 py-2 text-left hover:bg-red-600 hover:text-white transition duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mostrar Historial
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-red-600 hover:text-white transition duration-200 rounded-b-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
