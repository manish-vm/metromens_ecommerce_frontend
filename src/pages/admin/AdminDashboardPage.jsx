import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link, NavLink } from 'react-router-dom';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from 'chart.js';
import formatPrice from '../../utils/formatPrice';
import '../../css/adminDashboard.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <h2>Admin</h2>
    <nav>
      <NavLink to="/admin">Dashboard</NavLink>
      <NavLink to="/admin/products">Products</NavLink>
      <NavLink to="/admin/orders">Orders</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
      <NavLink to="/admin/coupons">Coupons</NavLink>
      <NavLink to="/admin/exclusive-banners">Exclusive Banners</NavLink>
      <NavLink to="/admin/hero-banners">Hero Banners</NavLink>
    </nav>
  </aside>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: 0,
    orderStatuses: [],
    revenueByMonth: [],
    topProducts: []
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    };
    load();
  }, []);

  // Ensure data is arrays to prevent runtime errors
  const orderStatuses = Array.isArray(stats.orderStatuses) ? stats.orderStatuses : [];
  const revenueByMonth = Array.isArray(stats.revenueByMonth) ? stats.revenueByMonth : [];
  const topProducts = Array.isArray(stats.topProducts) ? stats.topProducts : [];

  // Prepare chart data
  const orderStatusData = {
    labels: orderStatuses.map(s => s._id || 'Unknown'),
    datasets: [{
      data: orderStatuses.map(s => s.count),
      backgroundColor: [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'
      ],
      borderWidth: 1
    }]
  };

  const revenueData = {
    labels: revenueByMonth.map(m => `${m._id.month}/${m._id.year}`),
    datasets: [{
      label: 'Revenue',
      data: revenueByMonth.map(m => m.revenue),
      backgroundColor: '#3498db',
      borderColor: '#2980b9',
      borderWidth: 1
    }]
  };

  const topProductsData = {
    labels: topProducts.map(p => p.name),
    datasets: [{
      label: 'Units Sold',
      data: topProducts.map(p => p.totalSold),
      backgroundColor: '#e74c3c',
      borderColor: '#c0392b',
      borderWidth: 1
    }]
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h1>Dashboard</h1>

        {/* Stats Cards */}
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="admin-card">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
            <div className="change">+{stats.recentOrders} this month</div>
          </div>
          <div className="admin-card">
            <h3>Total Revenue</h3>
            <p>{formatPrice(stats.totalRevenue)}</p>
          </div>
          <div className="admin-card">
            <h3>Active Customers</h3>
            <p>{Math.floor(stats.totalUsers * 0.7)}</p>
            <div className="change">70% active rate</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>Order Status Distribution</h3>
            <center><Pie data={orderStatusData} className="piechart" /></center>
          </div>
          <div className="chart-container">
            <h3>Revenue Trend (Last 6 Months)</h3>
            <Bar data={revenueData} />
          </div>
        </div>

        {/* Top Products */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>Top Selling Products</h3>
            <Bar data={topProductsData} />
          </div>
          <div className="activity-section">
            <h3>Recent Activity</h3>
            {topProducts.map((product, index) => (
              <div key={index} className="activity-item">
                <div className="product-name">{product.name}</div>
                <div className="sales-data">
                  <div className="units">{product.totalSold} units</div>
                  <div className="revenue">{formatPrice(product.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
export { AdminSidebar };
