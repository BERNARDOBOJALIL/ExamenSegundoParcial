import { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Order from './components/Order';
import Payment from './components/Payment';
import History from './components/History';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import { loginUser, logoutUser, getUserData } from './services/auth';
import SessionManager from './services/sessionManager';
import UserHistory from './components/UserHistory';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute'; 
import PublicRoute from './components/PublicRoute';   

const menuItems = [
  { id: 1, name: 'Tacos', price: 50 },
  { id: 2, name: 'Enchiladas', price: 60 },
  { id: 3, name: 'Quesadillas', price: 45 },
  { id: 4, name: 'Pozole', price: 70 },
];

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
      localStorage.removeItem('userData');
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserName('');
    } else {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Router>
      <SessionManager onLogin={handleLogin} onLogout={handleLogout} inactivityLimit={60000} />
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
              path="/history"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  {isAdmin ? <History /> : <Navigate to="/" />}
                </PrivateRoute>
              }
            />
            <Route
              path="/order"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  {isAdmin ? (
                    <Navigate to="/history" />
                  ) : (
                    <Order
                      order={order}
                      increaseQuantity={increaseQuantity}
                      decreaseQuantity={decreaseQuantity}
                      removeFromOrder={removeFromOrder}
                      clearOrder={clearOrder}
                      menuItems={menuItems}
                      addToOrder={addToOrder}
                      userName={userName}
                      isAuthenticated={isAuthenticated}
                      isAdmin={isAdmin}
                      onLogout={handleLogout}
                    />
                  )}
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  {isAdmin ? (
                    <History />
                  ) : (
                    <Order
                      order={order}
                      increaseQuantity={increaseQuantity}
                      decreaseQuantity={decreaseQuantity}
                      removeFromOrder={removeFromOrder}
                      clearOrder={clearOrder}
                      menuItems={menuItems}
                      addToOrder={addToOrder}
                      userName={userName}
                      isAuthenticated={isAuthenticated}
                      isAdmin={isAdmin}
                      onLogout={handleLogout}
                    />
                  )}
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
