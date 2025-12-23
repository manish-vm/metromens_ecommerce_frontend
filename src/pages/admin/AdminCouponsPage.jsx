import { createCoupon, getCoupons, updateCoupon, deleteCoupon } from '../../services/couponService';
import { uploadImage } from '../../services/productService';
import { toast } from 'react-toastify';
import '../../css/admincoupons.css';
import { AdminSidebar } from './AdminDashboardPage';
import React, { useState, useEffect } from 'react';
const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    expiryDate: '',
    isActive: true
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to load coupons');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImage(file);
        setFormData(prev => ({ ...prev, image: imageUrl }));
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon._id, formData);
        toast.success('Coupon updated successfully');
      } else {
        await createCoupon(formData);
        toast.success('Coupon created successfully');
      }
      loadCoupons();
      resetForm();
    } catch (error) {
      toast.error('Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      title: coupon.title,
      description: coupon.description,
      image: coupon.image,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
      isActive: coupon.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        toast.success('Coupon deleted successfully');
        loadCoupons();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      expiryDate: '',
      isActive: true
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  return (
   <div className="admin-layout">
    <AdminSidebar />
    <div className="coupon-content">
      <div className="admin-content">
      <div className="admin-header">
        <h1>Coupon Management</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Coupon'}
        </button>
      </div>
      <br></br>
      {showForm && (
        <div className="admin-form">
          <h2>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h2>
          <form onSubmit={handleSubmit} className="coupon-form">
            <div className="form-group">
              <label className='admin-label'>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {formData.image && (
                <img src={formData.image} alt="Coupon" style={{ width: '100px', marginTop: '10px' }} />
              )}
            </div>

            <div className="form-group">
              <label>Coupon Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Discount Type</label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="form-group">
              <label>Discount Value</label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Minimum Order Value</label>
              <input
                type="number"
                name="minOrderValue"
                value={formData.minOrderValue}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Maximum Discount</label>
              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Usage Limit</label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>

            <div className='checkbox-input' >
              <label>Active Status</label>
                <input 
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                
              
            </div>

            <button type="submit" className="btn-primary">
              {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </form>
        </div>
      )}

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Code</th>
              <th>Discount</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon._id}>
                <td>{coupon.title}</td>
                <td>{coupon.code}</td>
                <td>
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`
                  }
                </td>
                <td>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}</td>
                <td>{coupon.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(coupon)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(coupon._id)}
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
    </div>
    </div>
  );
};

export default AdminCouponsPage;
