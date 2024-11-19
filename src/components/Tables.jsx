import React, { useEffect, useState } from 'react';
import { getTables } from '../services/tablesService';

const Tables = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      const tablesData = await getTables();
      setTables(tablesData);
    };

    fetchTables();
  }, []);

  return (
    <div className="min-h-screen bg-yellow-100 p-5">
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
              Estado: <span className="font-bold">{table.state ? 'Ocupada' : 'Disponible'}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
