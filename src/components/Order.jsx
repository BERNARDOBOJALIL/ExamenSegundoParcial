import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Payment from './Payment';
import UserHistory from './UserHistory';
import TableSelector from './TablesSelector';

const Order = ({
  order,
  increaseQuantity,
  decreaseQuantity,
  removeFromOrder,
  clearOrder,
  menuItems,
  addToOrder,
  userName,
  isAuthenticated,
  selectedTable,
  setSelectedTable,
}) => {
  useEffect(() => {
    const savedTable = localStorage.getItem('selectedTable');
    if (savedTable && savedTable !== "null") {
      setSelectedTable(savedTable);  
    } else {
      setSelectedTable(null); 
    }
  }, [setSelectedTable]);

  useEffect(() => {
    if (selectedTable) {
      localStorage.setItem('selectedTable', selectedTable);  
    }
  }, [selectedTable]);

  const handleTableSelect = (tableNumber) => {
    setSelectedTable(tableNumber);  
  };


  const totalAmount = order.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="container mx-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {!selectedTable ? (
          <div className="col-span-3">
            <TableSelector onTableSelect={handleTableSelect} />
          </div>
        ) : (
          <>
            <div className="col-span-2 lg:col-span-2">
              <Menu menuItems={menuItems} addToOrder={addToOrder} />
            </div>
            <div className="col-span-1 space-y-4">
              <h2 className="text-2xl font-semibold text-green-700">
                Mesa: {selectedTable}
              </h2>
              <h2 className="text-2xl font-semibold text-green-700">Tu Orden</h2>
              <div className="bg-white p-4 shadow-lg rounded-lg border-2 border-red-500">
                {order.length === 0 ? (
                  <p className="text-red-600">No hay nada. ¡Pide algo!</p>
                ) : (
                  order.map((item) => (
                    <div key={item.id} className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">
                          {item.name} x {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item)}
                          className="bg-green-600 text-white px-2 py-1 rounded-lg"
                        >
                          +
                        </button>
                        <button
                          onClick={() => decreaseQuantity(item)}
                          className="bg-yellow-600 text-white px-2 py-1 rounded-lg"
                        >
                          -
                        </button>
                        <button
                          onClick={() => removeFromOrder(item)}
                          className="bg-red-600 text-white px-2 py-1 rounded-lg"
                        >
                          Eliminar
                        </button>
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
              <div>
                <Payment order={order} clearOrder={clearOrder} clientName={userName} />
              </div>
            </div>

            {isAuthenticated && (
              <div className="col-span-3">
                <UserHistory clientName={userName} />
              </div>
            )}
            
          </>
        )}
      </div>
    </div>
  );
};

export default Order;

