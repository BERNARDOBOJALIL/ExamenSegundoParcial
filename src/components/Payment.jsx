import React, { useState, useEffect } from 'react';
import { addOrder } from '../services/orderService';
import { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {generateEmailMessage} from '../services/emailService'
import { createCard, getCard, getUID } from '@/services/paymentsService';
import {
  FaPlusCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUtensils,
  FaIdBadge,
  FaTrashAlt,
  FaInfoCircle,
} from 'react-icons/fa';
import Modal from 'react-modal';

const Payment = ({ order, clearOrder, clientName, selectedTable }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [splitBill, setSplitBill] = useState(false);
  const [splitValue, setSplitValue] = useState(2);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });
  const [hasCard, setHasCard] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'success', 'error'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async() =>{
      const uid = await userUID();
      const data = await getCard(uid);
      if (data !== null){
        setCardDetails({
          cardNumber: data.card,
          expiryDate: '',
          cvv: '',
          name: '',
        })
        setHasCard(true)
      }
    }
    fetchInfo();
  }, []);

  const validDiscountCodes = {
    EMMETT: 0.1,
  };
  
  const userUID = async() =>{
    const userData = JSON.parse(localStorage.getItem("userData"))
    const email = userData.email;
    const uid = await getUID(email);
    return uid;
  }

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
  const finalTotal = splitBill ? (totalWithDiscount / splitValue).toFixed(2) : totalWithDiscount.toFixed(2);

  const handlePay = async () => {
    if (paymentMethod === '') {
      alert('Seleccione un método de pago.');
      return;
    }

    else if (paymentMethod === 'card' && isCardModalOpen === false) {
      setPaymentStatus(null)
      setIsCardModalOpen(true);
      return;
    }
    else{
      await upload_payment_database();
      setPaymentStatus('success')
      setIsCardModalOpen(true);
      return;
    }
    
  };

  const upload_payment_database = async() => {
    const orderData = {
      items: order.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      payment: paymentMethod,
      timestamp: Timestamp.now(),
      total: finalTotal,
      client: clientName,
      state: 'En preparación',
      table_number: selectedTable,
    };

    try {
      const uid_order = await addOrder(orderData);
      //TODO Quitar comentarios de los mails
      //await generateEmailMessage(orderData, uid_order);
      clearOrder();
    } catch (error) {
      console.error('Error al guardar la orden:', error);
    }
  }

  const handleCardSubmit = async() => {
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.name) {
      alert('Por favor, complete todos los campos del formulario de tarjeta.');
      return;
    }

    if (cardDetails.cardNumber === '1111111111111111') {
      setPaymentStatus('error');
    } else {
      setPaymentStatus('success');
      try{
        if (!hasCard){
          const uid = await userUID(); 
          await createCard(cardDetails.cardNumber, uid);
        }
        upload_payment_database();
      }
      catch(e){
        console.error("Error: ", e);
      }
    }
  };

  const handleCardModal = () =>{
    setPaymentStatus(null);
    setIsCardModalOpen(false);
    if (paymentStatus === 'success') {navigate('/')};
  }

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
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg mt-4"
        >
          Aplicar
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="paymentMethod" className="block text-lg font-semibold mb-2">
          Método de Pago:
        </label>
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
      {paymentMethod === 'card' && (
        <>
          <div className="mb-4">
            <input
              type="checkbox"
              checked={splitBill}
              onChange={(e) => setSplitBill(e.target.checked)}
              className="mr-2"
            />
            <label>¿Dividir la cuenta?</label>
          </div>
          {splitBill && (
            <div className="mb-4">
              <label htmlFor="splitValue" className="block text-lg font-semibold mb-2">
                Dividir entre:
              </label>
              <select
                id="splitValue"
                value={splitValue}
                onChange={(e) => setSplitValue(Number(e.target.value))}
                className="border-2 border-yellow-600 rounded-lg p-2 w-full"
              >
                {[...Array(7)].map((_, i) => (
                  <option key={i + 2} value={i + 2}>
                    {i + 2}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
      <div className="flex justify-between font-bold text-lg text-red-600">
        <span>Total con descuento:</span>
        <span>${finalTotal}</span>
      </div>
      <button
        onClick={handlePay}
        className={`mt-5 w-full ${
          order.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        } text-white px-4 py-2 gap-2 flex items-center justify-center rounded-lg`}
        disabled={order.length === 0}
      >
        <FaCheckCircle /> Pagar
      </button>

      <Modal
        isOpen={isCardModalOpen || paymentStatus !== null}
        onRequestClose={() => {
          setIsCardModalOpen(false);
          setPaymentStatus(null);
        }}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {paymentStatus === null & paymentMethod !== 'cash' ? (
          <div className="bg-white rounded-lg p-6 shadow-lg w-96 relative">
            <button
              onClick={() => setIsCardModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-center mb-6">Pago con tarjeta</h2>
            <div className="flex justify-center mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
                className="h-6 mx-2"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                alt="MasterCard"
                className="h-6 mx-2"
              />
            </div>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Número de tarjeta:</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  maxLength={16}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCardDetails((prev) => ({ ...prev, cardNumber: value }));
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre en la tarjeta:</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => {
                    const value = e.target.value
                    setCardDetails((prev) => ({ ...prev, name: value }));
                  }}
                  placeholder="Ex. Paco Perez"
                  className="border rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-400"
                />
              </div>
              <div className="flex gap-4 mb-4">
                <div className="w-1/2">
                  <label className="block text-gray-700">Fecha de expiración:</label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    maxLength={5}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length > 2) {
                        const month = Math.min(12, Math.max(0, parseInt(value.slice(0, 2)))); // Asegurarse de que el mes esté entre 00 y 12
                        const year = value.slice(2, 4); // Tomar los dos últimos caracteres como año
                        value = month.toString().padStart(2, '0') + '/' + year;
                      }
                      setCardDetails((prev) => ({ ...prev, expiryDate: value }));
                    }}
                    placeholder="MM/AA"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-400"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700">CVV:</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    maxLength={3}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setCardDetails((prev) => ({ ...prev, cvv: value }));
                    }}
                    placeholder="•••"
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-400"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleCardSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 gap-2 items-center justify-center flex rounded-lg"
              >
                <FaCheckCircle /> Pagar
              </button>
            </form>
          </div>
        ) : (
          <div
            className={`bg-white rounded-lg p-6 shadow-lg w-96 relative ${
              paymentStatus === 'success' ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <button
              onClick={handleCardModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <div className="text-center" >
              {paymentStatus === 'success' ? (
                <div className="flex flex-col justify-center items-center">
                  <div className="text-green-500 text-4xl mb-4"><FaCheckCircle /></div>
                  <h2 className="text-xl font-bold text-green-500">ÉXITO</h2>
                  {paymentMethod === 'cash' ? <p>Pronto llegara un mesero con su cuenta.</p> :
                  <p>Pago procesado con éxito.</p>} 
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <div className="text-red-500 text-4xl mb-4"><FaTimesCircle /></div>
                  <h2 className="text-xl font-bold text-red-500">ERROR</h2>
                  <p>Hubo un error procesando el pago. Intente después.</p>
                </div>
              )}
            </div>
            <button
              onClick={handleCardModal}
              className={`mt-4 w-full ${
                paymentStatus === 'success' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }   px-4 py-2 rounded-lg flex justify-center items-center gap-2`}
            >
              {paymentStatus === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}Continuar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payment;