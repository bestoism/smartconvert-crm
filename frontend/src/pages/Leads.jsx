import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Button, Card, CardBody, Heading, Table, Thead, Tbody, Tr, Th, Td, 
  Badge, Progress, HStack, Text, useToast, Spinner, Center, IconButton, Flex, Spacer, Select
} from '@chakra-ui/react';
import { FiUpload, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../api';
import { Link } from 'react-router-dom';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(0); 
  const [totalCount, setTotalCount] = useState(0); // State untuk total data
  const [sortOption, setSortOption] = useState('newest'); // State untuk sorting

  const toast = useToast();
  const fileInputRef = useRef(null); 
  const limit = 10; // Jumlah data per halaman

  // 1. Fungsi Ambil Data (Leads + Total Count)
  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Kita panggil 2 API sekaligus: Data Leads & Statistik (untuk dapat total count)
      const [leadsResponse, statsResponse] = await Promise.all([
        api.get(`/leads?skip=${page * limit}&limit=${limit}&sort_by=${sortOption}`),
        api.get('/dashboard/stats') // Kita "pinjam" endpoint ini untuk tau total data
      ]);

      setLeads(leadsResponse.data);
      setTotalCount(statsResponse.data.total_leads); // Simpan total data

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

  // Reload saat page ATAU sortOption berubah
  useEffect(() => {
    fetchLeads();
  }, [page, sortOption]); 

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
      toast({ title: "Upload Berhasil", status: "success", duration: 3000 });
      fetchLeads(); // Refresh data
    } catch (error) {
      toast({ title: "Upload Gagal", status: "error", duration: 3000 });
    } finally {
      setUploading(false);
      event.target.value = null; 
    }
  };

  const getBadgeColor = (label) => {
    if (label === 'High Potential') return 'green';
    if (label === 'Medium Potential') return 'yellow';
    return 'red';
  };

  // Hitung index data yang sedang ditampilkan
  const startEntry = totalCount === 0 ? 0 : (page * limit) + 1;
  const endEntry = Math.min((page + 1) * limit, totalCount);

  return (
    <Box p={{ base: 4, md: 8 }}>
      <Flex 
        mb={6} 
        alignItems="center"
        direction={{ base: "column", md: "row" }} 
        gap={4}
      >
        <Heading size={{ base: "md", md: "lg" }} color="white">
          Leads Data
        </Heading>
        
        <Spacer />
        
        {/* --- FITUR SORTING (BARU) --- */}
        <Select 
          w={{ base: "full", md: "200px" }} 
          bg="gray.800" 
          color="white" 
          borderColor="gray.600"
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setPage(0); // Reset ke halaman 1 setiap ganti sorting
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="score_high">Highest Score</option>
          <option value="score_low">Lowest Score</option>
        </Select>
        {/* --------------------------- */}

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
          onClick={() => fileInputRef.current.click()} 
          w={{ base: "full", md: "auto" }}
        >
          Upload CSV
        </Button>
      </Flex>

      <Card bg="gray.800">
        <CardBody p={{ base: 3, md: 5 }}>
          {loading ? (
            <Center p={10}><Spinner color="green.400" /></Center>
          ) : (
            <>
              <Box overflowX="auto">
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
                      <Tr key={lead.id} _hover={{ bg: "gray.700" }} whiteSpace="nowrap">
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

              {/* --- FOOTER PAGINATION (BARU) --- */}
              <Flex mt={4} justifyContent="space-between" alignItems="center" direction={{ base: "column", md: "row" }} gap={4}>
                
                {/* Teks Showing X-Y of Z */}
                <Text color="gray.400" fontSize="sm">
                  Showing <Text as="span" fontWeight="bold" color="white">{startEntry}-{endEntry}</Text> of <Text as="span" fontWeight="bold" color="white">{totalCount}</Text> entries
                </Text>

                {/* Tombol Next/Prev */}
                <Flex>
                  <IconButton 
                    icon={<FiChevronLeft />} 
                    onClick={() => setPage(p => Math.max(0, p - 1))} 
                    isDisabled={page === 0}
                    mr={2}
                    size="sm"
                  />
                  <Text mx={2} fontSize="sm" alignSelf="center">Page {page + 1}</Text>
                  <IconButton 
                    icon={<FiChevronRight />} 
                    onClick={() => setPage(p => p + 1)} 
                    isDisabled={endEntry >= totalCount} // Disable jika sudah di akhir data
                    ml={2}
                    size="sm"
                  />
                </Flex>
              </Flex>
              {/* ------------------------------- */}
            </>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default Leads;