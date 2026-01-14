import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import LandingPage from './pages/LandingPage'; // <--- Import Baru
import Documentation from './pages/Documentation'; // <--- Import Baru
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

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
        {/* --- PUBLIC ROUTES (Bisa diakses tanpa login) --- */}
        
        {/* Halaman Depan: Jika sudah login masuk Dashboard, jika belum masuk Landing Page */}
        <Route 
          path="/" 
          element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" replace />} 
        />
        
        <Route path="/docs" element={<Documentation />} />

        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
        />

        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} 
        />

        {/* --- PROTECTED ROUTES (Butuh Login) --- */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Box minH="100vh" bg="gray.900">
                <Sidebar />
                <Box 
                  ml={{ base: 0, md: 60 }} 
                  p={{ base: 0, md: 4 }} 
                  transition="margin-left 0.3s ease"
                >
                  <Routes>
                    {/* Kita ubah path dashboard jadi /dashboard biar rapi */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:id" element={<LeadDetail />} />
                    <Route path="/profile" element={<MyProfile />} />
                    {/* Kalau user nyasar ke link ngawur setelah login, balikin ke dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Box>
              </Box>
            ) : (
              // Jika mencoba akses route terproteksi tapi belum login, lempar ke Landing Page (atau Login)
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;