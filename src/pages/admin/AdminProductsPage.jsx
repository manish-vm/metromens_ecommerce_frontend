import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminSidebar } from './AdminDashboardPage';
import { getProducts, deleteProduct } from '../../services/productService';
import formatPrice from '../../utils/formatPrice';
import '../../css/adminProductEdit.css';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const load = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const result = await getProducts({ page, limit: 10, search });
      setProducts(result.products || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1, searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await deleteProduct(id);
      load(currentPage);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Products</h1>
          <div className="admin-header-actions">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input1"
              />
              <button type="submit" className="search-btn">Search</button>
            </form>
            <button
              className="btn-primary-addproduct"
              onClick={() => navigate('/admin/products/new')}
            >
              Add Product
            </button>
          </div>
        </div>
        {loading ? (
          <div>Loading products...</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.category?.name}</td>
                    <td>
                      <button className="product-edit-btn" onClick={() => navigate(`/admin/products/${p._id}`)}>
                        Edit</button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="link-button danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => load(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-secondary"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => load(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
