import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Heading, Text, Avatar, Card, CardBody, 
  SimpleGrid, Icon, Divider, Progress, VStack, HStack, Spinner, Center
} from '@chakra-ui/react';
// Pastikan semua ikon yang dipakai (FiTrendingUp, dll) ada di sini
import { FiMail, FiCalendar, FiTarget, FiAward, FiBarChart2, FiClock, FiTrendingUp } from 'react-icons/fi';
import api from '../api';

const InfoRow = ({ icon, label, value }) => (
  <HStack spacing={4} py={3}>
    <Icon as={icon} color="green.400" />
    <Box>
      <Text color="gray.500" fontSize="xs" fontWeight="bold" textTransform="uppercase">
        {label}
      </Text>
      <Text color="white" fontWeight="medium">{value}</Text>
    </Box>
  </HStack>
);

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        setProfile(response.data);
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Center h="80vh"><Spinner size="xl" color="green.400" /></Center>;

  return (
    <Box p={8} bg="gray.900" minH="100vh">
      <Heading size="lg" color="white" mb={8}>My Profile</Heading>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        
        {/* KOLOM KIRI: Identitas Utama */}
        <Card bg="gray.800" borderRadius="2xl" p={6} textAlign="center">
          <CardBody>
            <VStack spacing={4}>
              <Avatar 
                size="2xl" 
                name={profile.name} 
                src="https://bit.ly/broken-link" // Ganti dengan URL foto jika ada
                border="4px solid"
                borderColor="green.400"
              />
              <Box>
                <Heading size="md" color="white">{profile.name}</Heading>
                <Text color="green.400" fontSize="sm" fontWeight="bold">{profile.role}</Text>
              </Box>
              
              <Divider borderColor="gray.700" />
              
              <VStack align="stretch" w="full" spacing={0}>
                <InfoRow icon={FiAward} label="Employee ID" value={profile.id_emp} />
                <InfoRow icon={FiCalendar} label="Joined Since" value={profile.joined_date} />
                <InfoRow icon={FiMail} label="Work Email" value={profile.email} />
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* KOLOM TENGAH & KANAN: Performa & Aktivitas */}
        <VStack spacing={8} gridColumn={{ lg: "span 2" }} align="stretch">
          
          {/* Dashboard Performa Singkat */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg="gray.800" borderRadius="xl">
              <CardBody>
                <HStack>
                  <Icon as={FiBarChart2} color="blue.400" />
                  <Text color="gray.400" fontSize="sm">Leads Processed</Text>
                </HStack>
                <Heading size="lg" color="white" mt={2}>{profile.stats.leads_processed}</Heading>
              </CardBody>
            </Card>

            <Card bg="gray.800" borderRadius="xl">
              <CardBody>
                <HStack>
                  <Icon as={FiTrendingUp} color="green.400" />
                  <Text color="gray.400" fontSize="sm">Conversion Rate</Text>
                </HStack>
                <Heading size="lg" color="white" mt={2}>{profile.stats.conversion_rate}%</Heading>
              </CardBody>
            </Card>

            <Card bg="gray.800" borderRadius="xl">
              <CardBody>
                <HStack>
                  <Icon as={FiClock} color="orange.400" />
                  <Text color="gray.400" fontSize="sm">Active Days</Text>
                </HStack>
                <Heading size="lg" color="white" mt={2}>12 Days</Heading>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Monthly Target Progress */}
          <Card bg="gray.800" borderRadius="2xl">
            <CardBody p={8}>
              <Flex justify="space-between" align="center" mb={4}>
                <HStack>
                  <Icon as={FiTarget} color="red.400" boxSize={6} />
                  <Heading size="md" color="white">Monthly Sales Target</Heading>
                </HStack>
                <Text color="gray.400" fontWeight="bold">
                   {profile.stats.current_progress} / {profile.stats.monthly_target} Leads
                </Text>
              </Flex>
              
              <Box mb={2}>
                <Progress 
                  value={(profile.stats.current_progress / profile.stats.monthly_target) * 100} 
                  colorScheme="red" 
                  borderRadius="full" 
                  size="lg"
                  bg="gray.700"
                />
              </Box>
              <Text color="gray.500" fontSize="sm">
                Target ini berdasarkan jumlah 'High Potential' leads yang berhasil diidentifikasi bulan ini.
              </Text>
            </CardBody>
          </Card>

          {/* Recent Sales Notes (Simulasi) */}
          <Card bg="gray.800" borderRadius="2xl">
            <CardBody>
              <Heading size="sm" color="white" mb={4}>Recent Activity</Heading>
              <VStack align="stretch" spacing={4}>
                <Box p={3} bg="whiteAlpha.50" borderRadius="md">
                  <Text fontSize="xs" color="gray.500">2 hours ago</Text>
                  <Text color="white" fontSize="sm">Processed batch upload of 1000 leads for Year-End campaign.</Text>
                </Box>
                <Box p={3} bg="whiteAlpha.50" borderRadius="md">
                  <Text fontSize="xs" color="gray.500">Yesterday</Text>
                  <Text color="white" fontSize="sm">Analyzed High Potential lead #Nasabah-4338 with 84% probability.</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default MyProfile;