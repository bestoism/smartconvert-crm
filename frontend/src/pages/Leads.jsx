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
      // Ambil 10 data per halaman
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
    <Box p={{ base: 4, md: 8 }}> {/* Padding responsif */}
      <Flex 
        mb={6} 
        alignItems="center"
        direction={{ base: "column", sm: "row" }} // Header menumpuk di HP
        gap={{ base: 4, sm: 0 }}
      >
        <Heading size={{ base: "md", md: "lg" }} color="white" w="full">
          Leads Data
        </Heading>
        <Spacer display={{ base: "none", sm: "block" }} />
        
        {/* Tombol Upload */}
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
          onClick={() => fileInputRef.current.click()} 
          w={{ base: "full", sm: "auto" }} // Tombol full width di HP
        >
          Upload CSV
        </Button>
      </Flex>

      <Card bg="gray.800">
        <CardBody p={{ base: 3, md: 5 }}>
          {loading ? (
            <Center p={10}><Spinner color="green.400" /></Center>
          ) : (
            /* --- PENERAPAN PERUBAHAN DI SINI --- */
            <Box overflowX="auto"> {/* SAKTI: Wrapper agar tabel bisa di-scroll horizontal */}
              <Table variant="simple" colorScheme="whiteAlpha" size="md">
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
                    <Tr key={lead.id} _hover={{ bg: "gray.700" }} whiteSpace="nowrap"> {/* whiteSpace agar teks tidak turun */}
                      <Td>#{lead.id}</Td>
                      <Td textTransform="capitalize">{lead.job}</Td>
                      <Td textTransform="capitalize">{lead.marital}</Td>
                      <Td>
                        <Badge colorScheme={getBadgeColor(lead.prediction_label)}>
                          {lead.prediction_label}
                        </Badge>
                      </Td>
                      <Td minW="200px">
                        <HStack>
                          <Text fontSize="sm" w="40px">{(lead.prediction_score * 100).toFixed(0)}%</Text>
                          <Progress 
                            value={lead.prediction_score * 100} 
                            size="sm" 
                            width="100%" 
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
            </Box>
            /* --- AKHIR PERUBAHAN --- */
          )}
          
          {/* Pagination */}
          <Flex mt={4} justifyContent={{ base: "center", md: "flex-end" }} alignItems="center">
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
              isDisabled={leads.length < 10} 
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