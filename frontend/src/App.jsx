import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads'; 
import LeadDetail from './pages/LeadDetail';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <Router>
      <Flex h="100vh" bg="gray.900">
        <Sidebar />
        <Box flex="1" ml={{ base: 0, md: 60 }} bg="gray.900" overflowY="auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} /> {/* <--- GANTI DI SINI */}
            {/* Kita siapkan route untuk detail nanti */}
            <Route path="/leads/:id" element={<LeadDetail />} /> {/* <--- Ganti di sini */}
            <Route path="/profile" element={<MyProfile />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;