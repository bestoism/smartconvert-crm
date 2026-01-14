import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
// PERUBAHAN DI SINI: Ganti BrowserRouter menjadi HashRouter
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Komponen & Halaman
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Documentation from './pages/Documentation';

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
    // Router sekarang menggunakan HashRouter (URL pakai #)
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
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

        {/* --- PROTECTED ROUTES --- */}
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
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:id" element={<LeadDetail />} />
                    <Route path="/profile" element={<MyProfile />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Box>
              </Box>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;