import { useState } from 'react';
import Menu from './components/Menu';
import Order from './components/Order';
import Payment from './components/Payment';
import History from './components/History';

const menuItems = [
  { id: 1, name: 'Tacos', price: 50 },
  { id: 2, name: 'Enchiladas', price: 60 },
  { id: 3, name: 'Quesadillas', price: 45 },
  { id: 4, name: 'Pozole', price: 70 },
];

function App() {
  const [order, setOrder] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

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

  return (
    <div className="min-h-screen bg-yellow-100">
      <header className="bg-red-600 text-white p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold">Restaurante El Sabor de Berny</h1>
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          {isAdmin ? "Salir del Modo Admin" : "Soy Administrador"}
        </button>
      </header>

      <div className="container mx-auto p-5">
        {!isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Menu menuItems={menuItems} addToOrder={addToOrder} />
            <div>
              <Order
                order={order}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromOrder={removeFromOrder}
                clearOrder={clearOrder}
              />
              <Payment order={order} clearOrder={clearOrder} />
            </div>
          </div>
        ) : (
          <History />
        )}
      </div>
    </div>
  );
}

export default App;
