import { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Order from './components/Order';
import Payment from './components/Payment';
import { getOrders } from './services/orderService';

const menuItems = [
  { id: 1, name: 'Tacos', price: 50 },
  { id: 2, name: 'Enchiladas', price: 60 },
  { id: 3, name: 'Quesadillas', price: 45 },
  { id: 4, name: 'Pozole', price: 70 },
];

function App() {
  const [order, setOrder] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ordersFromDB, setOrdersFromDB] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (isAdmin) {
      const fetchOrders = async () => {
        try {
          const data = await getOrders();
  
          const sortedChronologically = data.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
  
          const numberedData = sortedChronologically.map((order, index) => ({
            ...order,
            orderNumber: index + 1, 
          }));
  
          const filteredData = numberedData.filter((order) => {
            const orderDate = new Date(order.timestamp.seconds * 1000);
            const orderTime = orderDate.toTimeString().slice(0, 5);
  
            const withinDateRange = (!startDate || orderDate >= new Date(`${startDate}T00:00`)) &&
                                    (!endDate || orderDate <= new Date(`${endDate}T23:59`));
            const withinTimeRange = (!startTime || orderTime >= startTime) &&
                                    (!endTime || orderTime <= endTime);
  
            return withinDateRange && withinTimeRange;
          });
  
          const sortedData = filteredData.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
              comparison = b.timestamp.seconds - a.timestamp.seconds;
            } else if (sortBy === 'total') {
              comparison = b.total - a.total;
            }
            return sortOrder === 'asc' ? -comparison : comparison;
          });
  
          setOrdersFromDB(sortedData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetchOrders();
    }
  }, [isAdmin, startDate, endDate, startTime, endTime, sortBy, sortOrder]);
  

  const addToOrder = (item) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((orderItem) => orderItem.id === item.id);
      if (existingItem) {
        return prevOrder.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      } else {
        return [...prevOrder, { ...item, quantity: 1 }];
      }
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

  return (
    <div className="min-h-screen bg-yellow-100">
      <header className="bg-red-600 text-white p-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Restaurante El Sabor de Berny</h1>
          <p className="italic">Disfruta el auténtico sabor de Atlixco</p>
        </div>
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          {isAdmin ? "Salir del Modo Admin" : "Soy Administrador"}
        </button>
      </header>

      <div className="container mx-auto p-5">
        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Menu menuItems={menuItems} addToOrder={addToOrder} />
            <div>
              <Order 
                order={order} 
                increaseQuantity={increaseQuantity} 
                decreaseQuantity={decreaseQuantity} 
                removeFromOrder={removeFromOrder} 
              />
              <Payment order={order} clearOrder={clearOrder} />
            </div>
          </div>
        )}

{isAdmin && (
  <div>
    <div className="p-6 bg-amber-50 rounded-lg mt-6 shadow-md border-2 border-orange-400">
      <div className="h-4 w-full bg-repeat-x mb-4" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='4' viewBox='0 0 20 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4l4 4 4-4h4' fill='none' stroke='%23EA580C' stroke-width='1'/%3E%3C/svg%3E")`
      }}></div>

      <h3 className="text-2xl font-bold mb-4 text-orange-800">Filtros y Ordenación</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-orange-700 mb-1">Fecha de Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-2 border-orange-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-orange-700 mb-1">Fecha de Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-2 border-orange-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-orange-700 mb-1">Hora de Inicio</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border-2 border-orange-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-orange-700 mb-1">Hora de Fin</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border-2 border-orange-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-orange-700 mb-1">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-2 border-orange-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="date">Fecha</option>
            <option value="total">Total</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-orange-700 mb-1">Orden</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border-2 border-orange-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            setStartDate('');
            setEndDate('');
            setStartTime('');
            setEndTime('');
            setSortBy('date');
            setSortOrder('desc');
          }}
          className="group relative px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-bold text-lg shadow-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2zM21 9H15V22H13V16H11V22H9V9H3V7H21V9z"/>
            </svg>
            <span>Limpiar Filtros</span>
            <svg className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2zM21 9H15V22H13V16H11V22H9V9H3V7H21V9z"/>
            </svg>
          </div>
        </button>
      </div>

      <div className="h-4 w-full bg-repeat-x mt-4" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='4' viewBox='0 0 20 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 4h4l4-4 4 4h4' fill='none' stroke='%23EA580C' stroke-width='1'/%3E%3C/svg%3E")`
      }}></div>
    </div>
    
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-center text-green-700 mb-4">Historial</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ordersFromDB.map((dbOrder, index) => (
          <div key={dbOrder.id} className="bg-white p-4 shadow-lg rounded-lg border-2 border-blue-500 flex flex-col h-full">
            <div className="flex-grow">
              <p> Orden #{dbOrder.orderNumber}</p>
              <p className="text-sm text-gray-500">Fecha: {new Date(dbOrder.timestamp.seconds * 1000).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Método de Pago: {dbOrder.payment}</p>
              <h4 className="text-md font-semibold mt-2">Items:</h4>
              {dbOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg text-blue-700 mt-auto">
              <span>Total:</span>
              <span>${dbOrder.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default App;
