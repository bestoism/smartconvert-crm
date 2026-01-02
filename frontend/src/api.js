import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// TAMBAHKAN INI: Interceptor untuk menangani Token Expired atau Tidak Valid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jika Backend kirim error 401 (Unauthorized)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Paksa pindah ke login
    }
    return Promise.reject(error);
  }
);

// Tambahkan token ke setiap request jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;