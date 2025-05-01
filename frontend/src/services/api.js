import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; // Updated to match exact backend URL

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // Add timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const getItineraries = async () => {
  try {
    const response = await api.get('/api/v1/itineraries/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch itineraries:', error);
    throw error;
  }
};