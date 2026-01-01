import React from 'react';
import { Box, VStack, Text, Icon, Flex, Link } from '@chakra-ui/react';
import { FiHome, FiDatabase, FiUser } from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';

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
        bg={isActive ? 'green.400' : 'transparent'} // Warna hijau kalau aktif
        color={isActive ? 'white' : 'gray.400'}
        _hover={{
          bg: 'green.500',
          color: 'white',
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
        />
        <Text fontSize="md" fontWeight="medium">{children}</Text>
      </Flex>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <Box
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      bg="gray.900" // Latar belakang gelap
      borderRight="1px"
      borderRightColor="gray.700"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="xl" fontFamily="monospace" fontWeight="bold" color="green.400">
          SmartConvert
        </Text>
      </Flex>
      <VStack spacing={2} align="stretch">
        <SidebarItem icon={FiHome} to="/">Dashboard</SidebarItem>
        <SidebarItem icon={FiDatabase} to="/leads">Leads Data</SidebarItem>
        {/* Placeholder untuk halaman profile nanti */}
        <SidebarItem icon={FiUser} to="#">My Profile</SidebarItem> 
      </VStack>
    </Box>
  );
};

export default Sidebar;