// payment-frontend/src/services/paymentService.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api' // Use relative URL since we're using a proxy
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Initialize payment
export const initializePayment = async (paymentData) => {
  try {
    const response = await api.post('/payments/initialize', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error.response?.data || error;
  }
};

// Confirm payment
export const confirmPayment = async (paymentId, confirmationData) => {
  try {
    const response = await api.put(`/payments/confirm/${paymentId}`, confirmationData);
    return response.data;
  } catch (error) {
    console.error('Error confirming payment', error);
    throw error.response?.data || error;
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data.payment;
  } catch (error) {
    console.error('Error getting payment', error);
    throw error.response?.data || error;
  }
};

// Get payments by order ID
export const getPaymentsByOrderId = async (orderId) => {
  try {
    const response = await api.get(`/payments/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting payments by order ID', error);
    throw error.response?.data || error;
  }
};

// Get user payment history
export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payments/user');
    return response.data;
  } catch (error) {
    console.error('Error getting payment history', error);
    throw error.response?.data || error;
  }
};

// Get order details (for demo purposes)
export const getOrderDetails = async (orderId) => {
  try {
    // This should be an API call to the order service in a real app
    return {
      id: orderId || 'ORDER123',
      restaurant: {
        id: 'rest123',
        name: 'Delicious Bites Restaurant'
      },
      items: [
        { name: 'Chicken Biryani', quantity: 2, price: 850 },
        { name: 'Vegetable Curry', quantity: 1, price: 550 },
        { name: 'Mango Lassi', quantity: 2, price: 250 }
      ],
      subtotal: 2750,
      deliveryFee: 250,
      discount: 300,
      total: 2700,
      deliveryAddress: '123 Main St, Colombo 05, Sri Lanka',
      status: 'pending'
    };
  } catch (error) {
    console.error('Error getting order details', error);
    throw error;
  }
};