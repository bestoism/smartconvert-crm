import React from 'react';
import { Box, VStack, Text, Icon, Flex, Link } from '@chakra-ui/react';
import { FiHome, FiDatabase, FiUser, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link as={RouterLink} to={to} style={{ textDecoration: 'none' }} w="full">
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'green.400' : 'transparent'}
        color={isActive ? 'white' : 'gray.400'}
        _hover={{
          bg: 'green.500',
          color: 'white',
        }}
      >
        <Icon mr="4" fontSize="16" as={icon} />
        <Text fontSize="md" fontWeight="medium">
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <Box
      // --- PERUBAHAN DI SINI ---
      display={{ base: 'none', md: 'block' }} // Sembunyikan di HP (base), tampilkan blok di Laptop (md ke atas)
      w={60} // Lebar tetap 60 (karena hanya muncul di desktop)
      // -------------------------
      pos="fixed"
      h="full"
      bg="gray.900"
      borderRight="1px"
      borderRightColor="gray.700"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontSize="xl"
          fontFamily="monospace"
          fontWeight="bold"
          color="green.400"
        >
          SmartConvert
        </Text>
      </Flex>

      <VStack spacing={2} align="stretch">
        <SidebarItem icon={FiHome} to="/">Dashboard</SidebarItem>
        <SidebarItem icon={FiDatabase} to="/leads">Leads Data</SidebarItem>
        <SidebarItem icon={FiUser} to="/profile">My Profile</SidebarItem>
      </VStack>

      {/* Logout Button */}
      <Box pos="absolute" bottom="8" w="full" px="4">
        <Flex
          align="center"
          p="4"
          borderRadius="lg"
          cursor="pointer"
          color="red.400"
          _hover={{ bg: 'red.900', color: 'red.200' }}
          onClick={handleLogout}
        >
          <Icon mr="4" fontSize="16" as={FiLogOut} />
          <Text fontWeight="bold">Sign Out</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;