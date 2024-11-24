import React, { useEffect } from "react";
import Payment from "./Payment";
import { useNavigate } from "react-router-dom";

const Order = ({
  order,
  increaseQuantity,
  decreaseQuantity,
  removeFromOrder,
  clearOrder,
  addToOrder,
  userName,
  selectedTable,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userName) {
      localStorage.setItem(`order_${userName}`, JSON.stringify(order));
    }
  }, [order, userName]);

  const totalAmount = order.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const goToMenu = () => {
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="container mx-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="mt-10 col-span-1 space-y-4">
          <h2 className="text-2xl font-semibold text-green-700">Tu Orden</h2>
          <div className="bg-white p-4 shadow-lg rounded-lg border-2 border-red-500 space-y-4">
            {order.length === 0 ? (
              <p className="text-red-600">No hay nada. ¡Pide algo!</p>
            ) : (
              order.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between p-3 bg-gray-100 shadow-md rounded-lg"
                >
                  {/* Nombre y botones */}
                  <div className="flex items-center w-full md:w-2/3 space-x-4">
                    <div className="flex flex-col space-y-1">
                      <span
                        className="font-semibold text-gray-700 truncate w-32"
                        title={item.name}
                      
                      >
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        Precio por artículo: ${item.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => decreaseQuantity(item)}
                        className="bg-yellow-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-600"
                      >
                        -
                      </button>
                      <span className="font-bold text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item)}
                        className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-green-600"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Precio total y botón eliminar */}
                  <div className="flex items-center justify-between w-full md:w-auto space-x-4 mt-2 md:mt-0">
                    <span className="text-green-700 font-bold">
                      ${item.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeFromOrder(item)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      title="Eliminar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M9 3V4H4V6H5V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V6H20V4H15V3H9ZM7 6H17V20H7V6Z"
                        />
                      </svg>
                    </button>
                  </div>
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
            <Payment
              order={order}
              clearOrder={clearOrder}
              clientName={userName}
              selectedTable={selectedTable}
            />
          </div>
          <div>
            <button
              onClick={goToMenu}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg mr-4"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
