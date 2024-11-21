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
import { resetTableState } from './services/tablesService';
import AdminDashboard from './components/AdminDashboard';


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
  const [selectedTable, setSelectedTable] = useState(null);



  useEffect(() => {
    if (userName && selectedTable) {
      const savedOrder = localStorage.getItem(`order_${userName}_${selectedTable}`);
      setOrder(savedOrder ? JSON.parse(savedOrder) : []);
    }
  }, [userName, selectedTable]);

  useEffect(() => {
    if (userName && selectedTable) {
      localStorage.setItem(`order_${userName}_${selectedTable}`, JSON.stringify(order));
    }
  }, [order, userName, selectedTable]);

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

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (!error) {
      if (selectedTable) {
        console.log('Restableciendo el estado de la mesa:', selectedTable);
        await resetTableState(selectedTable);
      } else {
        console.log('No hay mesa seleccionada para restablecer el estado.');
      }

      if (userName && selectedTable) {
        localStorage.removeItem(`order_${userName}_${selectedTable}`);
      }

      localStorage.removeItem('userData');
      localStorage.removeItem('selectedTable');
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserName('');
      setSelectedTable(null);
      setOrder([]);
    } else {
      console.error('Error logging out:', error);
    }
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    localStorage.setItem('selectedTable', table);
  };

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

  return (
    <Router>
      <SessionManager
        onLogin={handleLogin}
        onLogout={handleLogout}
        onTableSelect={handleTableSelect}
        inactivityLimit={3600000}
      />
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
                  <Menu
                    addToOrder={addToOrder}
                    order={order}
                    setOrder={setOrder}
                    selectedTable={selectedTable}
                    setSelectedTable={setSelectedTable}
                  />
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
                    menuItems={menuItems}
                    addToOrder={addToOrder}
                    userName={userName}
                    isAuthenticated={isAuthenticated}
                    onLogout={handleLogout}
                    selectedTable={selectedTable}
                    setSelectedTable={setSelectedTable}
                    setOrder={setOrder}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  {isAdmin ? (
                    <AdminDashboard 
                      isAuthenticated={isAuthenticated} 
                      onLogout={handleLogout} 
                      userName={userName} 
                    />
                  ) : (
                    <Menu
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
                      selectedTable={selectedTable}
                      setSelectedTable={setSelectedTable}
                      setOrder={setOrder}
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

