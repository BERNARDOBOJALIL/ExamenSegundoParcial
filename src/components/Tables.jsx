import React, { useEffect, useState } from 'react';
import { db } from '../services/firebaseConfig'; 
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { createTable, updateTableState, deleteTable } from '../services/tablesService';
import Modal from 'react-modal';
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

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTableId, setDeleteTableId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tablesCollection = collection(db, 'Tables');
    const tablesQuery = query(tablesCollection, orderBy('Table_number', 'asc'));

    const unsubscribe = onSnapshot(
      tablesQuery,
      (snapshot) => {
        const fetchedTables = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTables(fetchedTables);
        setLoading(false);
      },
      (error) => {
        console.error('Error al escuchar cambios en Firestore:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCreateTable = async (e) => {
    e.preventDefault();
    if (!newTableNumber || isNaN(Number(newTableNumber))) {
      setModalMessage('Por favor, ingrese un número válido.');
      setIsModalOpen(true);
      return;
    }

    try {
      await createTable(newTableNumber);
      setNewTableNumber('');
      setModalMessage('Mesa creada exitosamente.');
    } catch (error) {
      console.error('Error al crear la mesa:', error);
      setModalMessage('Error al crear la mesa. Inténtalo de nuevo.');
    } finally {
      setIsModalOpen(true);
    }
  };

  const toggleTableState = async (tableId, currentState) => {
    try {
      const newState = !currentState;
      await updateTableState(tableId, newState);
    } catch (error) {
      console.error('Error al actualizar el estado de la mesa:', error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      if (deleteTableId) {
        await deleteTable(deleteTableId);
        closeModal();
      }
    } catch (error) {
      console.error('Error al eliminar la mesa:', error);
    }
  };

  const closeModal = () => {
    setModalMessage('');
    setIsModalOpen(false);
    setDeleteTableId(null);
  };

  const openDeleteModal = (tableId) => {
    setDeleteTableId(tableId);
    setModalMessage('¿Estás seguro de que deseas eliminar esta mesa?');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-yellow-100 p-5">
      <div className="mb-6 p-6 bg-yellow-100 shadow rounded-lg">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FaPlusCircle className="text-yellow-600" /> Agregar nueva mesa
        </h2>
        <form onSubmit={handleCreateTable} className="flex gap-4 items-center">
          <input
            type="text"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
            placeholder="Número de mesa"
            className="p-3 border border-gray-300 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-yellow-600 transition"
          >
            <FaCheckCircle /> Agregar mesa
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center text-lg text-gray-700">
          <FaSpinner className="animate-spin text-yellow-500 text-2xl" /> Cargando mesas...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`p-6 rounded-lg shadow-lg flex flex-col items-start ${
                table.State ? 'border-4 border-red-500 bg-red-100' : 'border-4 border-green-500 bg-green-100'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <FaUtensils /> Mesa #{table.Table_number}
              </h3>
              <p className="text-gray-600 flex items-center gap-2">
                <FaIdBadge className="text-yellow-600" /> ID: {table.id}
              </p>
              <p className="text-gray-700 flex items-center gap-2">
                <FaTimesCircle
                  className={table.State ? 'text-red-500' : 'hidden'}
                />
                <FaCheckCircle
                  className={!table.State ? 'text-green-500' : 'hidden'}
                />{' '}
                Estado: <span className="font-bold">{table.State ? 'Deshabilitada' : 'Habilitada'}</span>
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => toggleTableState(table.id, table.State)}
                  className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition ${
                    table.State ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {table.State ? <FaCheckCircle /> : <FaTimesCircle />}{' '}
                  {table.State ? 'Habilitar' : 'Inhabilitar'}
                </button>
                <button
                  onClick={() => openDeleteModal(table.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                >
                  <FaTrashAlt /> Eliminar mesa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20 text-center"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <p className="text-gray-800 text-lg flex items-center justify-center gap-2">
          <FaInfoCircle className="text-yellow-500" /> {modalMessage}
        </p>
        <div className="flex justify-center mt-4 gap-4">
          {deleteTableId ? (
            <>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition"
              >
                <FaTimesCircle /> Cancelar
              </button>
              <button
                onClick={handleDeleteTable}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
              >
                <FaCheckCircle /> Confirmar
              </button>
            </>
          ) : (
            <button
              onClick={closeModal}
              className="bg-gray-300  text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition"
            >
              <FaTimesCircle /> Cerrar
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Tables;
