import React, { useState } from 'react';

const Payment = ({ order, clearOrder }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

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

  const handlePay = () => {
    if (order.length === 0) return; 

    const orderData = {
      orderItems: order.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      totalAmount: totalWithDiscount,
    };

    const fileName = 'NoSeQueEstoyHaciendo.json';
    const json = JSON.stringify(orderData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    clearOrder();
    alert('Gracias por su compra!');
  };

  const totalAmount = order.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalWithDiscount = totalAmount - totalAmount * discount;

  return (
    <div className="mt-10 p-6 bg-white shadow-lg rounded-lg border-2 border-green-500">
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
