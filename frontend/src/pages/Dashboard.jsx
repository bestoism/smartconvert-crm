import React, { useEffect, useState } from 'react';
import { 
  Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, 
  StatArrow, Card, CardBody, Heading, Flex, Icon, Spinner, Center
} from '@chakra-ui/react';
import { FiUsers, FiTrendingUp, FiActivity, FiAlertCircle } from 'react-icons/fi';
import api from '../api'; // Import api client yang kita buat tadi

const StatCard = ({ label, value, helpText, icon, color }) => (
  <Card bg="gray.800" borderLeft="4px" borderLeftColor={color}>
    <CardBody>
      <Flex alignItems="center">
        <Box p={3} bg={`${color.split('.')[0]}.900`} borderRadius="md" mr={4}>
          <Icon as={icon} boxSize={6} color={color} />
        </Box>
        <Stat>
          <StatLabel color="gray.400">{label}</StatLabel>
          <StatNumber fontSize="2xl" color="white">{value}</StatNumber>
          {helpText && <StatHelpText mb={0}>{helpText}</StatHelpText>}
        </Stat>
      </Flex>
    </CardBody>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch Data dari Backend
  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Gagal mengambil data stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan saat halaman dibuka pertama kali
  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <Center h="50vh"><Spinner size="xl" color="green.400" /></Center>;
  }

  return (
    <Box p={8}>
      <Heading mb={6} size="lg" color="white">Dashboard Analytics</Heading>
      
      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard 
          label="Total Leads" 
          value={stats?.total_leads || 0} 
          icon={FiUsers} 
          color="blue.400" 
        />
        <StatCard 
          label="High Potential" 
          value={stats?.high_potential || 0} 
          helpText="Ready to call"
          icon={FiTrendingUp} 
          color="green.400" 
        />
        <StatCard 
          label="Medium Potential" 
          value={stats?.medium_potential || 0} 
          icon={FiActivity} 
          color="yellow.400" 
        />
        <StatCard 
          label="Conversion Est." 
          value={`${stats?.conversion_rate_estimate || 0}%`} 
          helpText="Based on prediction"
          icon={FiAlertCircle} 
          color="purple.400" 
        />
      </SimpleGrid>

      {/* Area Kosong untuk Grafik nanti */}
      <Card bg="gray.800" h="300px">
        <CardBody>
           <Center h="full" color="gray.500">
             Grafik Distribusi akan dipasang di sini (Step berikutnya)
           </Center>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Dashboard;