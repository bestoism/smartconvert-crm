import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, Button, Card, CardBody, Heading, Text, Flex, SimpleGrid, Badge, 
  VStack, HStack, Divider, Spinner, Center, Icon, Textarea, useToast,
  CircularProgress, CircularProgressLabel, Grid, GridItem
} from '@chakra-ui/react';
import { FiArrowLeft, FiPhone, FiUser, FiDollarSign, FiClock, FiMessageSquare } from 'react-icons/fi';
import api from '../api';

const LeadDetail = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const toast = useToast();

  const fetchData = async () => {
    try {
      const response = await api.get(`/leads/${id}`);
      setLead(response.data);
      setNote(response.data.notes || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const saveNote = async () => {
    try {
      await api.put(`/leads/${id}/notes`, { notes: note });
      toast({ title: "Note Saved", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: "Failed to save note", status: "error" });
    }
  };

  if (loading) return <Center h="80vh"><Spinner size="xl" color="green.400" /></Center>;

  return (
    <Box p={8} bg="gray.900" minH="100vh">
      {/* Header Area */}
      <Flex align="center" mb={6}>
        <Button as={Link} to="/leads" leftIcon={<FiArrowLeft />} variant="ghost" color="gray.400" _hover={{color: "white"}}>
          Back to Leads Data
        </Button>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
        
        {/* KOLOM 1: IDENTITAS & PROFIL */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            <Card bg="gray.800" borderRadius="xl" p={2}>
              <CardBody>
                <VStack align="center" mb={6}>
                  <Box p={4} bg="green.900" borderRadius="full" mb={2}>
                    <Icon as={FiUser} boxSize={8} color="green.400" />
                  </Box>
                  <Heading size="md" color="white">Nasabah-{lead.id}</Heading>
                  <Text fontSize="xs" color="gray.500">ID: IAP-{lead.id}-2025-UNESA</Text>
                  <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                    {lead.job}
                  </Badge>
                  <Button leftIcon={<FiPhone />} colorScheme="green" size="sm" w="full" mt={4}>
                    Call Customer
                  </Button>
                </VStack>

                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Personal Profile</Text>
                    <SimpleGrid columns={2} spacing={4} mt={2}>
                      <Box><Text color="gray.400" fontSize="xs">AGE</Text><Text color="white" fontWeight="bold">{lead.age} Years</Text></Box>
                      <Box><Text color="gray.400" fontSize="xs">MARITAL</Text><Text color="white" fontWeight="bold" textTransform="capitalize">{lead.marital}</Text></Box>
                      <Box><Text color="gray.400" fontSize="xs">EDUCATION</Text><Text color="white" fontWeight="bold" textTransform="capitalize">{lead.education}</Text></Box>
                    </SimpleGrid>
                  </Box>
                  
                  <Divider borderColor="gray.700" />
                  
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Financial Profile</Text>
                    <SimpleGrid columns={2} spacing={4} mt={2}>
                      <Box><Text color="gray.400" fontSize="xs">AVG BALANCE</Text><Text color="white" fontWeight="bold">€{lead.balance?.toLocaleString() || 0}</Text></Box>
                      <Box><Text color="gray.400" fontSize="xs">HOUSING LOAN</Text><Text color="white" fontWeight="bold">{lead.housing}</Text></Box>
                      <Box><Text color="gray.400" fontSize="xs">PERSONAL LOAN</Text><Text color="white" fontWeight="bold">{lead.loan}</Text></Box>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        {/* KOLOM 2: AI ANALYTICS & NOTES */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* AI Score Card */}
            <Card bg="gray.800" borderRadius="xl">
              <CardBody textAlign="center">
                <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">AI Conversion Score</Text>
                <CircularProgress 
                  value={lead.prediction_score * 100} 
                  size="150px" 
                  thickness="10px" 
                  color={lead.prediction_score > 0.7 ? "green.400" : "yellow.400"}
                >
                  <CircularProgressLabel color="white">
                    <Text fontSize="xl" fontWeight="bold">{(lead.prediction_score * 100).toFixed(0)}/100</Text>
                  </CircularProgressLabel>
                </CircularProgress>
                <Heading size="sm" mt={4} color="white">{lead.prediction_label}</Heading>
                <Text fontSize="xs" color="gray.500" mt={2}>Based on {lead.explanation?.shap_values.length} key AI factors</Text>
              </CardBody>
            </Card>

            {/* --- SISIPKAN INI (Next Best Conversation) --- */}
            <Card bg="blue.900" borderColor="blue.700" borderWidth={1}>
              <CardBody>
                <Flex align="start">
                  <Icon as={FiMessageSquare} w={5} h={5} color="blue.300" mt={1} mr={3} />
                  <Box>
                    <Heading size="xs" color="blue.200" mb={1} textTransform="uppercase">
                      AI Recommendation
                    </Heading>
                    <Text color="white" fontSize="md" fontStyle="italic">
                      "{lead.explanation?.recommendation || "Lakukan pendekatan standar."}"
                    </Text>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
            {/* --------------------------------------------- */}

            {/* Sales Note Card */}
            <Card bg="gray.800" borderRadius="xl">
              <CardBody>
                <HStack mb={4}>
                  <Icon as={FiMessageSquare} color="blue.400" />
                  <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">Sales Notes</Text>
                </HStack>
                <Textarea 
                  placeholder="Write follow-up result..." 
                  bg="gray.900" 
                  color="white" 
                  borderColor="gray.700" 
                  fontSize="sm"
                  rows={6}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button colorScheme="blue" size="sm" w="full" mt={3} onClick={saveNote}>
                  Save Note
                </Button>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        {/* KOLOM 3: CAMPAIGN HISTORY & SHAP */}
        <GridItem>
          <Card bg="gray.800" borderRadius="xl" h="full">
            <CardBody>
              <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">Campaign History</Text>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text color="gray.400" fontSize="sm">Last Contact</Text>
                  <Text color="white" fontWeight="bold" textTransform="capitalize">{lead.month}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.400" fontSize="sm">Contact Type</Text>
                  <Text color="white" fontWeight="bold" textTransform="capitalize">{lead.contact}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.400" fontSize="sm">Prev. Outcome</Text>
                  <Badge colorScheme={lead.poutcome === 'success' ? 'green' : 'red'}>{lead.poutcome}</Badge>
                </HStack>
              </VStack>

              <Divider my={6} borderColor="gray.700" />

              <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={4} textTransform="uppercase">AI Analysis (SHAP)</Text>
              <VStack align="stretch" spacing={3}>
                {lead.explanation?.shap_values.map((s, i) => (
                  <Box key={i}>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize="xs" color="gray.300">{s.feature.replace('_', ' ')}</Text>
                      <Text fontSize="xs" color={s.impact > 0 ? "green.400" : "red.400"}>
                        {s.impact > 0 ? "+" : ""}{(s.impact * 100).toFixed(1)}%
                      </Text>
                    </Flex>
                    <Box h="4px" bg="gray.700" borderRadius="full">
                      <Box 
                        h="full" 
                        bg={s.impact > 0 ? "green.400" : "red.400"} 
                        w={`${Math.min(Math.abs(s.impact) * 200, 100)}%`} 
                        borderRadius="full" 
                      />
                    </Box>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default LeadDetail;