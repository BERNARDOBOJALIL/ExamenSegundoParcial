import React from 'react';

const Order = ({ order, increaseQuantity, decreaseQuantity, removeFromOrder }) => {
  const totalAmount = order.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-5 text-green-700">Tu Orden</h2>
      <div className="bg-white p-4 shadow-lg rounded-lg border-2 border-red-500">
        {order.length === 0 ? (
          <p className="text-red-600">No hay nadaaaaaaaaaaa.</p>
        ) : (
          order.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">{item.name} x {item.quantity}</span>
                <button onClick={() => increaseQuantity(item)} className="bg-green-600 text-white px-2 py-1 rounded-lg">+</button>
                <button onClick={() => decreaseQuantity(item)} className="bg-yellow-600 text-white px-2 py-1 rounded-lg">-</button>
                <button onClick={() => removeFromOrder(item)} className="bg-red-600 text-white px-2 py-1 rounded-lg">Eliminar</button>
              </div>
              <span className="text-green-700 font-bold">${item.price * item.quantity}</span>
            </div>
          ))
        )}
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Order;
