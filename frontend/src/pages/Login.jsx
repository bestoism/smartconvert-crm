import React from 'react';
import { Box, Container, Heading, Text, VStack, Code, Button, Divider } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Documentation = () => {
  return (
    <Box bg="gray.900" minH="100vh" color="white" py={10}>
      <Container maxW="container.md">
        <Button as={Link} to="/" leftIcon={<FiArrowLeft />} variant="ghost" mb={6} color="gray.400" _hover={{ color: 'green.400' }}>
          Back to Home
        </Button>
        
        <VStack spacing={6} align="start">
          {/* Gradient Hijau ke Teal */}
          <Heading size="2xl" bgGradient="linear(to-r, green.400, teal.300)" bgClip="text">
            API Documentation
          </Heading>
          <Text color="gray.400" fontSize="lg">
            Panduan teknis penggunaan API SmartConvert CRM untuk integrasi sistem.
          </Text>

          <Divider borderColor="gray.700" />

          <Box w="full">
            <Heading size="md" mb={2}>Base URL</Heading>
            <Code p={2} borderRadius="md" w="full" bg="gray.800" color="green.400" border="1px solid" borderColor="gray.700">
              http://127.0.0.1:8000/api/v1
            </Code>
          </Box>

          <Box w="full">
            <Heading size="md" mb={2} color="green.300">POST /login</Heading>
            <Text color="gray.400" mb={2}>Otentikasi pengguna untuk mendapatkan Access Token.</Text>
            <Code p={4} borderRadius="md" w="full" display="block" whiteSpace="pre" bg="gray.800" border="1px solid" borderColor="gray.700">
{`{
  "username": "admin",
  "password": "password123"
}`}
            </Code>
          </Box>

          <Box w="full">
            <Heading size="md" mb={2} color="green.300">POST /upload-csv</Heading>
            <Text color="gray.400" mb={2}>Unggah data nasabah massal untuk prediksi batch.</Text>
            <Code p={4} borderRadius="md" w="full" display="block" whiteSpace="pre" bg="gray.800" border="1px solid" borderColor="gray.700">
              Content-Type: multipart/form-data
            </Code>
          </Box>
          
          <Text fontSize="sm" color="gray.500" pt={10}>
            © 2026 SmartConvert Developer Team.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Documentation;