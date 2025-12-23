import React, { useEffect, useState } from 'react';
import { AdminSidebar } from './AdminDashboardPage';
import { getAllOrders, updateOrderStatus, deleteOrder, downloadOrdersExcel } from '../../services/orderService';
import formatPrice from '../../utils/formatPrice';
import "../../css/adminOrders.css";
const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const load = async (search = '', date = '', month = '') => {
    const params = { search };
    if (date) params.date = date;
    if (month) params.month = month;
    const list = await getAllOrders(params);
    setOrders(list);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(searchTerm);
  };

  const updateStatus = async (id, status) => {
    await updateOrderStatus(id, { status });
    load();
  };

  const updatePaid = async (id, isPaid) => {
    await updateOrderStatus(id, { isPaid: isPaid === 'true' });
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await deleteOrder(id);
      load();
    }
  };

  const handleFilterChange = () => {
    if (filterType === 'date' && selectedDate) {
      load(searchTerm, selectedDate);
    } else if (filterType === 'month' && selectedMonth) {
      load(searchTerm, '', selectedMonth);
    } else {
      load(searchTerm);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const params = { search: searchTerm };
      if (filterType === 'date' && selectedDate) params.date = selectedDate;
      if (filterType === 'month' && selectedMonth) params.month = selectedMonth;
      await downloadOrdersExcel(params);
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Orders</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input1"
          />
          <button type="submit" className="search-btn">Search</button>
          <button type="button" className="download-excel-btn" onClick={handleDownloadExcel}>Download report</button>
        </form>
        <div className="filter-section" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">All Orders</option>
            <option value="date">Filter by Date</option>
            <option value="month">Filter by Month</option>
          </select>
          {filterType === 'date' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          )}
          {filterType === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          )}
          <button
            onClick={handleFilterChange}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Apply Filter
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Placed At</th>
              <th>Cancel Reason</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.orderId}</td>
                <td>{o.user?.email}</td>
                <td>{formatPrice(o.totalPrice)}</td>
                <td>
                  <select
                    className="paid-select"
                    value={o.isPaid.toString()}
                    onChange={(e) => updatePaid(o._id, e.target.value)}
                    style={{
                      padding: '0.25rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={o.status || 'Placed'}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    style={{
                      padding: '0.25rem',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    {['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  {o.status === 'Cancelled' && o.cancelReason
                    ? o.cancelReason
                    : '-'}
                </td>
                {/* <td>
                  <button
                    onClick={() => handleDelete(o._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
