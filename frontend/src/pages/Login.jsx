import React, { useState } from 'react';
import {
  Box, Flex, VStack, Heading, Text, FormControl, FormLabel, 
  Input, Button, useToast, Card, CardBody, InputGroup, InputRightElement
} from '@chakra-ui/react';
// Tambahkan FiArrowLeft untuk ikon kembali
import { FiLock, FiUser, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
// Tambahkan Link untuk navigasi
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      // Pastikan URL API sesuai dengan konfigurasi backend/deployment kamu
      // Jika sudah deploy, gunakan URL Vercel/Render, jika lokal gunakan localhost
      // Disarankan menggunakan instance api dari api.js jika memungkinkan, tapi axios langsung juga oke untuk login
      const response = await axios.post('http://127.0.0.1:8000/api/v1/login', formData);
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', username);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${username}!`,
        status: "success",
        duration: 3000,
      });

      // Arahkan ke /dashboard karena di App.jsx route '/' diarahkan ke Landing Page jika belum login
      navigate('/dashboard'); 
      window.location.reload(); 
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Tambahkan position="relative" agar tombol absolute bisa diposisikan relatif terhadap container ini
    <Flex minH="100vh" align="center" justify="center" bg="gray.900" position="relative">
      
      {/* --- TOMBOL KEMBALI (BARU) --- */}
      <Button
        as={Link}
        to="/"
        position="absolute"
        top={{ base: 4, md: 8 }}
        left={{ base: 4, md: 8 }}
        variant="ghost"
        color="gray.400"
        leftIcon={<FiArrowLeft />}
        _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
      >
        Back to Home
      </Button>
      {/* ----------------------------- */}

      <VStack spacing={8} w="full" maxW="md" p={6}>
        <VStack spacing={2} textAlign="center">
          <Heading color="green.400" size="xl">SmartConvert</Heading>
          <Text color="gray.400">Predictive Lead Scoring System</Text>
        </VStack>

        <Card bg="gray.800" w="full" borderRadius="2xl" boxShadow="2xl">
          <CardBody p={8}>
            <form onSubmit={handleLogin}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="xs">USERNAME</FormLabel>
                  <InputGroup>
                    <Input 
                      placeholder="Enter username" 
                      bg="gray.700" border="none" color="white"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="xs">PASSWORD</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Enter password" 
                      bg="gray.700" border="none" color="white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton 
                        variant="ghost" size="sm" color="gray.500"
                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button 
                  type="submit" 
                  colorScheme="green" w="full" size="lg" fontSize="md"
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Flex>
  );
};

// Helper component
const IconButton = ({ icon, onClick, ...props }) => (
  <Box as="button" onClick={onClick} type="button" {...props}>
    {icon}
  </Box>
);

export default Login;