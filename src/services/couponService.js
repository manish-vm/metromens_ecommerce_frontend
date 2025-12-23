import api from './api';

/* Admin */
export const createCoupon = (data) =>
  api.post('/coupons', data).then(res => res.data);

export const getCoupons = () =>
  api.get('/coupons').then(res => res.data);

export const updateCoupon = (id, data) =>
  api.put(`/coupons/${id}`, data).then(res => res.data);

export const deleteCoupon = (id) =>
  api.delete(`/coupons/${id}`).then(res => res.data);

/* User */
export const getActiveCoupons = () =>
  api.get('/coupons/').then(res => res.data);

export const applyCoupon = (data) =>
  api.post('/coupons/apply', data).then(res => res.data);
