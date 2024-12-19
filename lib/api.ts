import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const login = (email: string, password: string) =>
  api.post('/users/login', { email, password });

export const register = (email: string, password: string) =>
  api.post('/users/register', { email, password });

export const getProfile = () => api.get('/users/profile');

export const updateProfile = (data: any) => api.put('/users/profile', data);

export const getProducts = (page = 1, limit = 10) =>
  api.get('/products', { params: { page, limit } });

export const getProductById = (id: string) => api.get(`/products/${id}`);

export const searchProducts = (filters: any) =>
  api.get('/products/search', { params: filters });

export const addToCart = (productId: string, quantity: number) =>
  api.post('/cart', { productId, quantity });

export const getCart = () => api.get('/cart');

export const updateCartItem = (id: string, quantity: number) =>
  api.put(`/cart/${id}`, { quantity });

export const removeFromCart = (id: string) => api.delete(`/cart/${id}`);

export const createOrder = (items: any[], shippingAddress: any) =>
  api.post('/orders', { items, shippingAddress });

export const getOrders = () => api.get('/orders');

export const getOrderById = (id: string) => api.get(`/orders/${id}`);

export const addToWishlist = (productId: string) =>
  api.post('/wishlist', { productId });

export const getWishlist = () => api.get('/wishlist');

export const removeFromWishlist = (productId: string) =>
  api.delete(`/wishlist/${productId}`);

export const getSellerProducts = () => api.get('/seller/products');

export const getSellerOrders = () => api.get('/seller/orders');

export const getSellerAnalytics = (startDate: string, endDate: string) =>
  api.get('/seller/analytics', { params: { startDate, endDate } });

export const getAllUsers = () => api.get('/admin/users');

export const getFlaggedTransactions = () => api.get('/admin/transactions/flagged');

export const generatePlatformReport = (startDate: string, endDate: string) =>
  api.get('/admin/reports/platform', { params: { startDate, endDate } });

export const getProductGeographicData = (productId: string) =>
  api.get(`/products/${productId}/geographic-data`);

export const trackEvent = (eventData: any) =>
  api.post('/analytics/track', eventData);

export const getRealTimeData = (userId: string, isSeller: boolean) => {
  const endpoint = isSeller ? '/analytics/seller-dashboard' : '/analytics/admin-dashboard';
  return api.get(`${endpoint}/${userId}`);
};

// React Query hooks
export const useProducts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () => getProducts(page, limit),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export {
  login,
  register,
  getProfile,
  updateProfile,
  getProducts,
  getProductById,
  searchProducts,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  createOrder,
  getOrders,
  getOrderById,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getSellerProducts,
  getSellerOrders,
  getSellerAnalytics,
  getAllUsers,
  getFlaggedTransactions,
  generatePlatformReport,
  getProductGeographicData,
  trackEvent,
  getRealTimeData,
  useProducts,
  useProduct,
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useOrders,
  useOrder,
  useAddToWishlist,
};

export default api;

