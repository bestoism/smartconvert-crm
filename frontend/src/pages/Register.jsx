import React, { useState } from 'react';
import {
  Flex, VStack, Heading, Text, FormControl, FormLabel, 
  Input, Button, useToast, Card, CardBody, InputGroup, InputRightElement, Link as ChakraLink
} from '@chakra-ui/react';
import { FiUser, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Endpoint register menerima JSON biasa (bukan Form Data)
      await api.post('/register', {
        username: username,
        password: password
      });

      toast({
        title: "Registration Successful",
        description: "Account created! Please login.",
        status: "success",
        duration: 3000,
      });

      // Lempar ke halaman Login setelah sukses
      navigate('/login');

    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.detail || "Username already exists or error occurred.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.900" position="relative">
      <Button
        as={Link} to="/"
        position="absolute"
        top={{ base: 4, md: 8 }}
        left={{ base: 4, md: 8 }}
        variant="ghost" color="gray.400" leftIcon={<FiArrowLeft />}
        _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
      >
        Back to Home
      </Button>

      <VStack spacing={8} w="full" maxW="md" p={6}>
        <VStack spacing={2} textAlign="center">
          <Heading color="green.400" size="xl">Create Account</Heading>
          <Text color="gray.400">Join SmartConvert CRM</Text>
        </VStack>

        <Card bg="gray.800" w="full" borderRadius="2xl" boxShadow="2xl">
          <CardBody p={8}>
            <form onSubmit={handleRegister}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="xs">USERNAME</FormLabel>
                  <Input 
                    placeholder="Choose a username" 
                    bg="gray.700" border="none" color="white"
                    value={username} onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="xs">PASSWORD</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Choose a password" 
                      bg="gray.700" border="none" color="white"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                      <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button 
                  type="submit" 
                  colorScheme="green" w="full" size="lg" fontSize="md"
                  isLoading={isLoading}
                >
                  Register
                </Button>

                <Text color="gray.500" fontSize="sm">
                  Already have an account?{' '}
                  <ChakraLink as={Link} to="/login" color="green.400" fontWeight="bold">
                    Login here
                  </ChakraLink>
                </Text>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Flex>
  );
};

export default Register;