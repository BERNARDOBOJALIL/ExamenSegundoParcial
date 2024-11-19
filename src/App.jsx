import { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Order from './components/Order';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import { loginUser, logoutUser, getUserData } from './services/auth';
import SessionManager from './services/sessionManager';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  const [order, setOrder] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      const userData = await getUserData();
      if (userData && userData.role) {
        setIsAdmin(userData.role === 'admin');
        setIsAuthenticated(true);
        setUserName(userData.name);
      }
    };

    if (isAuthenticated) {
      fetchUserRole();
    }
  }, [isAuthenticated]);

  const addToOrder = (item) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((orderItem) => orderItem.id === item.id);
      return existingItem
        ? prevOrder.map((orderItem) =>
            orderItem.id === item.id
              ? { ...orderItem, quantity: orderItem.quantity + 1 }
              : orderItem
          )
        : [...prevOrder, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (item) => {
    setOrder((prevOrder) =>
      prevOrder.map((orderItem) =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      )
    );
  };

  const decreaseQuantity = (item) => {
    setOrder((prevOrder) => {
      return prevOrder
        .map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        )
        .filter((orderItem) => orderItem.quantity > 0);
    });
  };

  const removeFromOrder = (item) => {
    setOrder((prevOrder) => prevOrder.filter((orderItem) => orderItem.id !== item.id));
  };

  const clearOrder = () => {
    setOrder([]);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setIsAdmin(userData.role === 'admin');
    setUserName(userData.name);
  };

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (!error) {
      // Eliminar orden del usuario actual
      localStorage.removeItem(`order_${userName}`);
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserName('');
      setOrder([]); // Limpiar la orden
    } else {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Router>
      <SessionManager onLogin={handleLogin} onLogout={handleLogout} inactivityLimit={3600000} />
      <div className="min-h-screen bg-yellow-100">
        <Header
          isAdmin={isAdmin}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          userName={userName}
        />
        <div className="container mx-auto p-5">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute isAuthenticated={isAuthenticated}>
                  <LoginForm setIsAuthenticated={setIsAuthenticated} />
                </PublicRoute>
              }
            />
            <Route
              path="/menu"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Menu addToOrder={addToOrder} order={order} setOrder={setOrder} />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Order
                    order={order}
                    increaseQuantity={increaseQuantity}
                    decreaseQuantity={decreaseQuantity}
                    removeFromOrder={removeFromOrder}
                    clearOrder={clearOrder}
                    menuItems={[]}
                    addToOrder={addToOrder}
                    userName={userName}
                    isAuthenticated={isAuthenticated}
                    isAdmin={isAdmin}
                    onLogout={handleLogout}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? '/menu' : '/login'} />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
