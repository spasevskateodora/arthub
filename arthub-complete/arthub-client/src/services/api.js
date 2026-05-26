import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Artworks
export const getArtworks = (params) => API.get('/artworks', { params });
export const getArtwork = (id) => API.get(`/artworks/${id}`);
export const createArtwork = (formData) => API.post('/artworks', formData);
export const updateArtwork = (id, formData) => API.put(`/artworks/${id}`, formData);
export const deleteArtwork = (id) => API.delete(`/artworks/${id}`);

// Users
export const login = (data) => API.post('/users/login', data);
export const register = (data) => API.post('/users/register', data);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getOrders = () => API.get('/orders');
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);

// Reviews
export const getReviews = (artworkId) => API.get(`/reviews/${artworkId}`);
export const createReview = (data) => API.post('/reviews', data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Categories
export const getCategories = () => API.get('/categories');

export default API;
