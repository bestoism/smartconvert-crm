import axios from 'axios';

// Membuat instance Axios dengan konfigurasi default
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1', // Alamat Backend FastAPI kita
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;