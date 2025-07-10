import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <div className="text-lg font-semibold">Tenant Management Dashboard</div>
      <div className="flex items-center gap-4 text-sm">
        <span>{user.name} ({user.role})</span>
        <button
          onClick={onLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
