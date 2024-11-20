import React, { useEffect, useState } from 'react';
import { getTables, deleteTable, createTable, updateTableState } from '../services/tablesService';
import Modal from 'react-modal';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTableId, setDeleteTableId] = useState(null);

  
  useEffect(() => {
    const fetchTables = async () => {
      const tablesData = await getTables();
      setTables(tablesData);
    };

    fetchTables();
  }, []);


  const handleCreateTable = async (e) => {
    e.preventDefault();
    if (!newTableNumber || isNaN(Number(newTableNumber))) {
      setModalMessage('Por favor, ingrese un número válido.');
      setIsModalOpen(true);
      return;
    }

    await createTable(newTableNumber);
    setNewTableNumber(''); 

    const updatedTables = await getTables();
    setTables(updatedTables);

    setModalMessage('Mesa creada exitosamente.');
    setIsModalOpen(true);
  };

  const handleDeleteTable = async () => {
    if (deleteTableId) {
      await deleteTable(deleteTableId);
      const updatedTables = tables.filter((table) => table.id !== deleteTableId);
      setTables(updatedTables);
      closeModal();
    }
  };

  const toggleTableState = async (tableId, currentState) => {
    try {
      const newState = !currentState; 
      await updateTableState(tableId, newState); 

      
      const updatedTables = tables.map((table) =>
        table.id === tableId ? { ...table, state: newState } : table
      );
      setTables(updatedTables);
    } catch (error) {
      console.error('Error al actualizar el estado de la mesa:', error);
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
      <div className="mb-6 p-4 bg-yellow-100 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Agregar nueva mesa</h2>
        <form onSubmit={handleCreateTable} className="flex gap-4 items-center">
          <input
            type="text"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
            placeholder="Número de mesa"
            className="p-2 border border-gray-300 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Agregar mesa
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`p-4 rounded-lg shadow-lg ${
              table.state ? 'border-4 border-red-500' : 'border-4 border-green-500'
            } bg-white`}
          >
            <h2 className="text-xl font-semibold mb-2">Mesa #{table.Table_number}</h2>
            <p className="text-gray-700">ID: {table.id}</p>
            <p className="text-gray-700">
              Estado:{' '}
              <span className="font-bold">{table.state ? 'Deshabilitada' : 'Habilitada'}</span>
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => toggleTableState(table.id, table.state)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Toggle Estado
              </button>
              <button
                onClick={() => openDeleteModal(table.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Eliminar mesa
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20 text-center"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <p className="text-gray-800 text-lg">{modalMessage}</p>
        <div className="flex justify-center mt-4 gap-4">
          {deleteTableId ? (
            <>
              <button
                onClick={handleDeleteTable}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Confirmar
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={closeModal}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Cerrar
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Tables;
