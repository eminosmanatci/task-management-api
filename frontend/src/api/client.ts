import axios from 'axios';

// Backend'imizin çalıştığı adres
const API_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Her istekten önce çalışır
apiClient.interceptors.request.use((config) => {
  // Giriş yaptığımızda token'ı localStorage'a kaydedeceğiz.
  // Burada her istekte o token'ı alıp backend'e gönderiyoruz.
  const token = localStorage.getItem('token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});