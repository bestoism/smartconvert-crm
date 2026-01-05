import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen & Halaman
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';

function App() {
  // State untuk mengecek apakah user sudah login
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Sinkronisasi status login jika ada perubahan storage (misal logout dari tab lain)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route Login: Jika sudah login, redirect ke Home. Jika belum, tampilkan Login */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />

        {/* Route Terproteksi: Semua halaman di bawah ini butuh Login */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Flex h="100vh" bg="gray.900">
                <Sidebar />
                <Box 
                flex="1" 
                ml={{ base: 0, md: 60 }} // Mobile: margin 0, Desktop: margin 240px (lebar sidebar)
                p={{ base: 4, md: 8 }}   // Padding lebih kecil di mobile
                bg="gray.900" 
                overflowY="auto"
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
              </Flex>
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