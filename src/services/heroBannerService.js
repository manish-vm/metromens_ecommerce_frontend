import api from './api';

export const getHeroBanners = async () => {
  const { data } = await api.get('/hero-banners');
  return data;
};

export const createHeroBanner = async (payload) => {
  const { data } = await api.post('/hero-banners', payload);
  return data;
};

export const updateHeroBanner = async (id, payload) => {
  const { data } = await api.put(`/hero-banners/${id}`, payload);
  return data;
};

export const deleteHeroBanner = async (id) => {
  const { data } = await api.delete(`/hero-banners/${id}`);
  return data;
};

export const toggleHeroBannerStatus = async (id, payload) => {
  const { data } = await api.patch(`/hero-banners/${id}`, payload);
  return data;
};
