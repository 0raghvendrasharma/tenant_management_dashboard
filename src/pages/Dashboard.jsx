import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [tenants, setTenants] = useState([]);
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  role: 'admin',
  password: ''
});

  // ✅ Get current logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('tenantUser'));
  const isPrimeAdmin = user?.role === 'prime_admin';

  const fetchTenants = () => {
    api.get('/tenants')
      .then(res => setTenants(res.data))
      .catch(err => console.error('Error:', err));
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/tenants/${formData.id}`, formData);
      } else {
        await api.post('/tenants', formData);
      }
      setFormData({ name: '', email: '', role: 'admin', password: '' });
      fetchTenants();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

    const handleEdit = (tenant) => {
    setFormData({
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        role: tenant.role,
        password: '' //password blank edit
    });
    };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tenants/${id}`);
      fetchTenants();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tenant Management</h2>

      {/* ✅ Form only visible to prime_admin */}
      {isPrimeAdmin && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-100 p-4 rounded shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border p-2 w-full"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-2 w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              className="border p-2 w-full"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="admin">admin</option>
              <option value="prime_admin">prime_admin</option>
            </select>
            {!formData.id && (
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-2 w-full"
                value={formData.password}
                onChange={handleChange}
                required
            />
            )}
          </div>

          <div className="flex items-center mt-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {formData.id ? 'Update Tenant' : 'Add Tenant'}
            </button>
            {formData.id && (
              <button
                type="button"
                className="ms-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setFormData({ name: '', email: '', role: 'admin', password: '' })}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Tenant Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              {isPrimeAdmin && <th className="px-4 py-2 border">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="text-center">
                <td className="px-4 py-2 border">{tenant.id}</td>
                <td className="px-4 py-2 border">{tenant.name}</td>
                <td className="px-4 py-2 border">{tenant.email}</td>
                <td className="px-4 py-2 border">{tenant.role}</td>
                {isPrimeAdmin && (
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                      onClick={() => handleEdit(tenant)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDelete(tenant.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
