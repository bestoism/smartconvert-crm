import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Button, Card, CardBody, Heading, Table, Thead, Tbody, Tr, Th, Td, 
  Badge, Progress, HStack, Text, useToast, Spinner, Center, IconButton, Flex, Spacer
} from '@chakra-ui/react';
import { FiUpload, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../api';
import { Link } from 'react-router-dom';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(0); // Pagination start from 0
  
  const toast = useToast();
  const fileInputRef = useRef(null); // Referensi ke input file tersembunyi

  // 1. Fungsi Ambil Data Leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Ambil 10 data per halaman (bisa diubah limitnya)
      const response = await api.get(`/leads?skip=${page * 10}&limit=10`);
      setLeads(response.data);
    } catch (error) {
      toast({
        title: "Gagal memuat data",
        description: "Cek koneksi backend",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page]); // Reload kalau page berubah

  // 2. Fungsi Handle Upload File
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await api.post('/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast({
        title: "Upload Berhasil",
        description: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Refresh data setelah upload
      fetchLeads();
      
    } catch (error) {
      toast({
        title: "Upload Gagal",
        description: "Pastikan format CSV benar (separator ; atau ,)",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      // Reset input file biar bisa upload file yang sama lagi kalau mau
      event.target.value = null; 
    }
  };

  // Helper: Warna Badge berdasarkan Label
  const getBadgeColor = (label) => {
    if (label === 'High Potential') return 'green';
    if (label === 'Medium Potential') return 'yellow';
    return 'red';
  };

  return (
    <Box p={8}>
      <Flex mb={6} alignItems="center">
        <Heading size="lg" color="white">Leads Data</Heading>
        <Spacer />
        
        {/* Tombol Upload (Input File disembunyikan) */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".csv" 
          style={{ display: 'none' }} 
        />
        <Button 
          leftIcon={<FiUpload />} 
          colorScheme="green" 
          isLoading={uploading}
          loadingText="Processing..."
          onClick={() => fileInputRef.current.click()} // Trigger input file
        >
          Upload CSV
        </Button>
      </Flex>

      <Card bg="gray.800" overflowX="auto">
        <CardBody>
          {loading ? (
            <Center p={10}><Spinner color="green.400" /></Center>
          ) : (
            <Table variant="simple" colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th color="gray.400">ID</Th>
                  <Th color="gray.400">Job</Th>
                  <Th color="gray.400">Marital</Th>
                  <Th color="gray.400">Prediction</Th>
                  <Th color="gray.400">Score</Th>
                  <Th color="gray.400">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {leads.map((lead) => (
                  <Tr key={lead.id} _hover={{ bg: "gray.700" }}>
                    <Td>#{lead.id}</Td>
                    <Td textTransform="capitalize">{lead.job}</Td>
                    <Td textTransform="capitalize">{lead.marital}</Td>
                    <Td>
                      <Badge colorScheme={getBadgeColor(lead.prediction_label)}>
                        {lead.prediction_label}
                      </Badge>
                    </Td>
                    <Td width="200px">
                      <HStack>
                        <Text fontSize="sm" w="40px">{(lead.prediction_score * 100).toFixed(0)}%</Text>
                        <Progress 
                          value={lead.prediction_score * 100} 
                          size="sm" 
                          width="100px" 
                          colorScheme={getBadgeColor(lead.prediction_label)} 
                          borderRadius="full"
                        />
                      </HStack>
                    </Td>
                    <Td>
                      <Link to={`/leads/${lead.id}`}>
                        <Button size="sm" variant="outline" colorScheme="blue" rightIcon={<FiEye />}>
                          Detail
                        </Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          
          {/* Pagination Sederhana */}
          <Flex mt={4} justifyContent="flex-end" alignItems="center">
            <IconButton 
              icon={<FiChevronLeft />} 
              onClick={() => setPage(p => Math.max(0, p - 1))} 
              isDisabled={page === 0}
              mr={2}
              size="sm"
            />
            <Text mx={2} fontSize="sm">Page {page + 1}</Text>
            <IconButton 
              icon={<FiChevronRight />} 
              onClick={() => setPage(p => p + 1)} 
              isDisabled={leads.length < 10} // Disable kalau data kurang dari limit
              ml={2}
              size="sm"
            />
          </Flex>

        </CardBody>
      </Card>
    </Box>
  );
};

export default Leads;