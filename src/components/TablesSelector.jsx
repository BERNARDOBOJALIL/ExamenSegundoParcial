import React, { useState, useEffect } from 'react';
import { getTables, updateTableState } from '../services/tablesService';  

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
    <div className="space-y-4 text-center">
      <h2 className="text-xl font-semibold text-green-700">Selecciona tu mesa</h2>
      {loading ? (
        <p>Cargando mesas...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {tables.length === 0 ? (
            <p>No hay mesas disponibles.</p>
          ) : (
            tables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleTableSelection(table.Table_number)}
                className={`${
                  table.State ? 'bg-gray-500' : 'bg-blue-500'
                } text-white px-4 py-2 rounded-lg`}
                disabled={table.State}  
              >
                Mesa {table.Table_number}
              </button>
            ))
          )}
        </div>
      )}
      {selectedTable && (
        <p className="mt-4 text-green-700">Has seleccionado la Mesa {selectedTable}</p>
      )}
    </div>
  );
};

export default TableSelector;
