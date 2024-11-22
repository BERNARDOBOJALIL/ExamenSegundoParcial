import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { updateTableState } from '../services/tablesService';
import { FaChair } from 'react-icons/fa';

const TableSelector = ({ onTableSelect }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
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

  const handleTableSelection = async (tableNumber) => {
    const selected = tables.find((table) => table.Table_number === tableNumber);

    if (selected && !selected.State) {
      setSelectedTable(tableNumber);
      onTableSelect(tableNumber);

      try {
        await updateTableState(selected.id);
      } catch (error) {
        console.error('Error al actualizar el estado de la mesa:', error);
      }
    } else {
      alert('Esta mesa está ocupada. Selecciona otra mesa.');
    }
  };

  return (
    <div className="mt-20 min-h-screen bg-yellow-100 flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-8">
        🌮 Bienvenido, selecciona tu mesa
      </h2>
      {loading ? (
        <p className="text-xl text-orange-600">Cargando mesas...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {tables.length === 0 ? (
            <p className="text-lg text-red-600">No hay mesas disponibles.</p>
          ) : (
            tables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleTableSelection(table.Table_number)}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl shadow-2xl text-white text-3xl font-bold transition-transform transform hover:scale-110 ${
                  table.State ? 'bg-red-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={table.State}
              >
                <FaChair className="text-6xl" />
                Mesa {table.Table_number}
              </button>
            ))
          )}
        </div>
      )}
      {selectedTable && (
        <div className="mt-6 text-center">
          <p className="text-2xl text-green-700 font-bold">
            ✅ Has seleccionado la Mesa {selectedTable}
          </p>
        </div>
      )}
    </div>
  );
};

export default TableSelector;
