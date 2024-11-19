import React, { useState, useEffect } from 'react';
import { addOrder } from '../services/orderService'; 
import { Timestamp } from 'firebase/firestore'; 

const Payment = ({ order, clearOrder, clientName }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderProcessed, setOrderProcessed] = useState(false);

  const validDiscountCodes = {
    'EMMETT': 0.1,
  };

  const handleApplyDiscount = () => {
    if (validDiscountCodes[discountCode]) {
      setDiscount(validDiscountCodes[discountCode]);
      alert(`Código de descuento aplicado: ${discountCode}`);
    } else {
      alert('Código de descuento inválido');
      setDiscount(0);
    }
  };

  const totalAmount = order.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalWithDiscount = totalAmount - totalAmount * discount;

  const handlePay = async () => {
    if (order.length === 0 || paymentMethod === '') {
      alert('Seleccione un método de pago.');
      return;
    }

    const orderData = {
      items: order.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      payment: paymentMethod,
      timestamp: Timestamp.now(),
      total: totalWithDiscount,
      client: clientName, 
    };

    try {
      await addOrder(orderData);
      alert('Orden guardada en la base de datos.');
      setOrderProcessed(true);
    } catch (error) {
      console.error("Error al guardar la orden:", error);
      alert('Hubo un problema al guardar la orden.');
      return;
    }

    clearOrder();
    alert('Gracias por su compra!');
  };

  useEffect(() => {
    if (orderProcessed) {
      setOrderProcessed(false);
      setDiscountCode('');
      setDiscount(0);
      setPaymentMethod('');

      window.location.reload();
    }
  }, [orderProcessed]);

  
  return (
    <div className="mb-50 mt-10 p-6 bg-white shadow-lg rounded-lg border-2 border-green-500">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Código de descuento"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="border-2 border-yellow-600 rounded-lg p-2 mr-2"
        />
        <button
          onClick={handleApplyDiscount}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
        >
          Aplicar
        </button>
      </div>
      
      <div className="mb-4">
        <label htmlFor="paymentMethod" className="block text-lg font-semibold mb-2">Método de Pago:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border-2 border-yellow-600 rounded-lg p-2 w-full"
        >
          <option value="">Seleccione un método de pago</option>
          <option value="cash">Efectivo</option>
          <option value="card">Tarjeta</option>
        </select>
      </div>

      <div className="flex justify-between font-bold text-lg text-red-600">
        <span>Total con descuento:</span>
        <span>${totalWithDiscount.toFixed(2)}</span>
      </div>
      
      <button
        onClick={handlePay}
        className={`mt-5 w-full ${order.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-lg`}
        disabled={order.length === 0}
      >
        Pagar
      </button>
    </div>
  );
};

export default Payment;
