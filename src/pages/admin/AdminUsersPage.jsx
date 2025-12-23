import React, { useEffect, useState } from 'react';
import { AdminSidebar } from './AdminDashboardPage';
import api from '../../services/api';
import "../../css/adminOrders.css";
const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const load = async (search = '') => {
    const { data } = await api.get('/admin/users', { params: { search } });
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(searchTerm);
  };

  const toggleAdmin = async (u) => {
    await api.put(`/admin/users/${u._id}`, { isAdmin: !u.isAdmin });
    load();
  };

  const handleDelete = async (u) => {
    if (window.confirm('Delete this user?')) {
      await api.delete(`/admin/users/${u._id}`);
      load();
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Users</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input1"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className="link-button warning"
                    onClick={() => toggleAdmin(u)}
                  >
                    Toggle Admin
                  </button>
                  <button
                    className="link-button danger"
                    onClick={() => handleDelete(u)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
