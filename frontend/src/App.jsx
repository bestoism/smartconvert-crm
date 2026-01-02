import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login'; // Import Login

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Cek apakah ada token

  return (
    <Router>
      <Routes>
        {/* Route Login tidak pakai Sidebar */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

        {/* Semua Route ini butuh Login */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Flex h="100vh" bg="gray.900">
                <Sidebar />
                <Box flex="1" ml={{ base: 0, md: 60 }} bg="gray.900" overflowY="auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/leads/:id" element={<LeadDetail />} />
                    <Route path="/profile" element={<MyProfile />} />
                  </Routes>
                </Box>
              </Flex>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;