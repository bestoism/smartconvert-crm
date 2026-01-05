import React from 'react';
import {
  Box, Flex, Text, Icon, CloseButton, VStack, Link,
  Drawer, DrawerContent, useDisclosure, IconButton,
} from '@chakra-ui/react';
import { FiHome, FiDatabase, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

// 1. Komponen Isi Sidebar (Bisa dipakai di Desktop & Mobile)
const SidebarContent = ({ onClose, ...rest }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <Box
      bg="gray.900"
      borderRight="1px"
      borderRightColor="gray.700"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="xl" fontFamily="monospace" fontWeight="bold" color="green.400">
          SmartConvert
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} color="white" onClick={onClose} />
      </Flex>
      
      <VStack spacing={2} align="stretch">
        <NavItem icon={FiHome} to="/" onClick={onClose}>Dashboard</NavItem>
        <NavItem icon={FiDatabase} to="/leads" onClick={onClose}>Leads Data</NavItem>
        <NavItem icon={FiUser} to="/profile" onClick={onClose}>My Profile</NavItem>
      </VStack>

      <Box pos="absolute" bottom="8" w="full" px="4">
        <Flex
          align="center" p="4" borderRadius="lg" cursor="pointer" color="red.400"
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

// 2. Komponen Item Navigasi
const NavItem = ({ icon, children, to, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link as={RouterLink} to={to} style={{ textDecoration: 'none' }} w="full" onClick={onClick}>
      <Flex
        align="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer"
        bg={isActive ? 'green.400' : 'transparent'}
        color={isActive ? 'white' : 'gray.400'}
        _hover={{ bg: 'green.500', color: 'white' }}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

// 3. Komponen Header Mobile (Hamburger berada di sini)
const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg="gray.900"
      borderBottomWidth="1px"
      borderBottomColor="gray.700"
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      display={{ base: 'flex', md: 'none' }} // Hanya muncul di mobile
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        color="green.400"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="xl"
        fontFamily="monospace"
        fontWeight="bold"
        color="green.400"
      >
        SmartConvert
      </Text>
    </Flex>
  );
};

// 4. Komponen Utama Sidebar yang menggabungkan semuanya
const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      {/* Sidebar untuk Desktop */}
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      
      {/* Sidebar untuk Mobile (Drawer) */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent bg="gray.900">
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* Hamburger Menu Bar */}
      <MobileNav onOpen={onOpen} />
    </Box>
  );
};

export default Sidebar;