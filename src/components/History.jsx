import { useState, useEffect } from 'react';
import { AllOrders } from '../services/orderService';

function History({ isAuthenticated, onLogout, userName }) {
  const [ordersFromDB, setOrdersFromDB] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showHistory, setShowHistory] = useState(false); 

  useEffect(() => {
   
    const unsubscribe = AllOrders(
      {
        startDate,
        endDate,
        startTime,
        endTime,
        sortBy,
        sortOrder,
      },
      (data) => {
        setOrdersFromDB(data); 
      }
    );

    
    return () => {
      unsubscribe();
    };
  }, [startDate, endDate, startTime, endTime, sortBy, sortOrder]); 

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setSortBy('date');
    setSortOrder('desc');
  };

  return (
    <div>
      <div className="mt-28 p-6 bg-amber-50 rounded-lg mt-6 shadow-md border-2 border-orange-400">
        <div
          className="h-4 w-full bg-repeat-x mb-4"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='4' viewBox='0 0 20 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4l4 4 4-4h4' fill='none' stroke='%23EA580C' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <h3 className="text-2xl font-bold mb-4 text-orange-800">Filtros y Ordenación del Historial de Compras</h3>
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
            onClick={resetFilters}
            className="group relative px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-bold text-lg shadow-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 animate-bounce" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2zM21 9H15V22H13V16H11V22H9V9H3V7H21V9z" />
              </svg>
              <span>Limpiar Filtros</span>
              <svg
                className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2zM21 9H15V22H13V16H11V22H9V9H3V7H21V9z" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-6 py-3 bg-green-600 text-white font-bold text-lg rounded-full hover:bg-green-700 transition-all duration-200"
        >
          {showHistory ? 'Ocultar Historial' : 'Mostrar Historial'}
        </button>
      </div>

      {showHistory && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ordersFromDB.length === 0 ? (
              <p className="text-center text-gray-500">No se encontraron órdenes.</p>
            ) : (
              ordersFromDB.map((dbOrder) => (
                <div key={dbOrder.id} className="bg-white p-4 shadow-lg rounded-lg border-2 border-blue-500 flex flex-col h-full">
                  <div className="flex-grow">
                    <p>ID de Orden: {dbOrder.id}</p>
                    <p className="text-sm text-gray-500">
                      Fecha:{' '}
                      {dbOrder.timestamp?.seconds
                        ? new Date(dbOrder.timestamp.seconds * 1000).toLocaleString()
                        : 'No disponible'}
                    </p>
                    <p className="text-sm text-gray-500">Cliente: {dbOrder.client || 'No especificado'}</p>
                    <p className="text-sm text-gray-500">Método de Pago: {dbOrder.payment || 'Desconocido'}</p>
                    <h4 className="text-md font-semibold mt-2">Items:</h4>
                    {dbOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default History;