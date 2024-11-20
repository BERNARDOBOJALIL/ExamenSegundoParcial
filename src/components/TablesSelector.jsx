import React, { useState, useEffect } from 'react';
import { getTables, updateTableState } from '../services/tablesService';
import { FaChair } from 'react-icons/fa'; 

const TableSelector = ({ onTableSelect }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const fetchedTables = await getTables();
        setTables(fetchedTables);
      } catch (error) {
        console.error('Error al obtener las mesas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);
  const handleTableSelection = async (tableNumber) => {
    const selected = tables.find((table) => table.Table_number === tableNumber);

    if (selected && !selected.State) {
      setSelectedTable(tableNumber);
      onTableSelect(tableNumber);

      await updateTableState(selected.id);
    } else {
      alert('Esta mesa está ocupada. Selecciona otra mesa.');
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6">
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
