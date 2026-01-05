import React from 'react';
import { Box } from '@chakra-ui/react'; // Flex dihapus karena tidak lagi digunakan di struktur baru
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen & Halaman
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';

function App() {
  // Logic sesuai permintaan: Langsung cek localStorage tanpa useState/useEffect
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Route Login: Jika sudah login, redirect ke Home. Jika belum, tampilkan Login */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />

        {/* Route Terproteksi */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              // Gunakan Box sebagai pembungkus utama agar lebih stabil (minH 100vh)
              <Box minH="100vh" bg="gray.900">
                {/* Sidebar mengandung logic Drawer & Desktop Sidebar */}
                <Sidebar />
                
                {/* Konten Utama dengan penyesuaian margin, padding, dan transisi */}
                <Box 
                  ml={{ base: 0, md: 60 }} 
                  p={{ base: 0, md: 4 }} 
                  transition="margin-left 0.3s ease"
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:id" element={<LeadDetail />} />
                    <Route path="/profile" element={<MyProfile />} />
                    {/* Catch-all jika route tidak ditemukan */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
              </Box>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

// --- BARIS INI WAJIB ADA ---
export default App;