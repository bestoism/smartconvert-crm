import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

// Placeholder untuk halaman Leads (biar tidak error dulu)
const LeadsPage = () => <Box p={10} color="white">Halaman Leads Data (Coming Soon)</Box>;

function App() {
  return (
    <Router>
      <Flex h="100vh" bg="gray.900">
        {/* Sidebar di kiri (fixed width) */}
        <Sidebar />
        
        {/* Konten di kanan (flexible width) */}
        <Box flex="1" ml={{ base: 0, md: 60 }} bg="gray.900" overflowY="auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<LeadsPage />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;