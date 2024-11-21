import React from 'react';
import History from './History';
import Tables from './Tables';
import AddProductForm from './AddProductForm';

function AdminDashboard({ isAuthenticated, onLogout, userName }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-6">Admin Dashboard</h1>
      <div className="mt-10">
        <Tables />
      </div>
      <div className="mt-10">
        <History isAuthenticated={isAuthenticated} onLogout={onLogout} userName={userName} />
      </div>
      <div className="mt-10">
        <AddProductForm />
      </div>
    </div>
  );
}

export default AdminDashboard;
