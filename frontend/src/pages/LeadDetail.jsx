import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, Button, Card, CardBody, CardHeader, Heading, Text, Flex, 
  SimpleGrid, Badge, VStack, HStack, Divider, Spinner, Center, Icon
} from '@chakra-ui/react';
import { FiArrowLeft, FiPhone, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';

const LeadDetail = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadDetail = async () => {
      try {
        const response = await api.get(`/leads/${id}`);
        setLead(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetail();
  }, [id]);

  if (loading) return <Center h="80vh"><Spinner size="xl" color="green.400" /></Center>;
  if (!lead) return <Text>Data not found</Text>;

  // Data untuk Grafik SHAP
  const shapData = lead.explanation?.shap_values || [];

  return (
    <Box p={8}>
      <Button as={Link} to="/leads" leftIcon={<FiArrowLeft />} mb={6} variant="ghost">
        Back to Leads
      </Button>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        
        {/* KIRI: Profil & Prediksi */}
        <VStack spacing={6} align="stretch">
          <Card bg="gray.800">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md" color="white">Lead Profile #{lead.id}</Heading>
                <Badge colorScheme={lead.prediction_label === 'High Potential' ? 'green' : 'yellow'} fontSize="0.9em" p={1}>
                  {lead.prediction_label}
                </Badge>
              </Flex>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={2} spacing={4} mb={6}>
                <Box>
                  <Text color="gray.400" fontSize="sm">Full Name (Dummy)</Text>
                  <Text fontWeight="bold" color="white">Nasabah-{lead.id}</Text>
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="sm">Job</Text>
                  <Text fontWeight="bold" color="white" textTransform="capitalize">{lead.job}</Text>
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="sm">Marital Status</Text>
                  <Text fontWeight="bold" color="white" textTransform="capitalize">{lead.marital}</Text>
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="sm">Education</Text>
                  <Text fontWeight="bold" color="white" textTransform="capitalize">{lead.education}</Text>
                </Box>
              </SimpleGrid>
              
              <Divider mb={4} borderColor="gray.600"/>
              
              <Text color="gray.400" fontSize="sm" mb={2}>Prediction Score</Text>
              <Flex align="center">
                <Heading size="2xl" color={lead.prediction_score > 0.7 ? "green.400" : "yellow.400"}>
                  {(lead.prediction_score * 100).toFixed(1)}%
                </Heading>
                <Text ml={3} color="gray.400">Probability of conversion</Text>
              </Flex>
            </CardBody>
          </Card>

          {/* Next Best Conversation */}
          <Card bg="blue.900" borderColor="blue.700" borderWidth={1}>
            <CardBody>
              <Flex align="start">
                <Icon as={FiPhone} w={6} h={6} color="blue.300" mt={1} mr={3} />
                <Box>
                  <Heading size="sm" color="blue.200" mb={1}>Next Best Conversation</Heading>
                  <Text color="white" fontSize="lg">
                    "{lead.explanation?.recommendation || "Gali kebutuhan investasi standar."}"
                  </Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </VStack>

        {/* KANAN: Explainability (SHAP) */}
        <Card bg="gray.800">
          <CardHeader>
            <HStack>
              <Icon as={FiCheckCircle} color="green.400" />
              <Heading size="md" color="white">Why this score?</Heading>
            </HStack>
            <Text fontSize="sm" color="gray.400" mt={1}>
              Top factors influencing the AI prediction (SHAP Values)
            </Text>
          </CardHeader>
          <CardBody>
            <Box h="300px" w="100%">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical" margin={{ left: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="feature" 
                    type="category" 
                    width={100} 
                    tick={{fill: 'white', fontSize: 12}} 
                  />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#2D3748', border: 'none'}} 
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="impact" barSize={20}>
                    {shapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#48BB78' : '#F56565'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Flex justify="center" mt={4} fontSize="sm">
              <HStack spacing={6}>
                <HStack><Box w={3} h={3} bg="green.400" borderRadius="full"/><Text color="gray.400">Meningkatkan Skor</Text></HStack>
                <HStack><Box w={3} h={3} bg="red.400" borderRadius="full"/><Text color="gray.400">Menurunkan Skor</Text></HStack>
              </HStack>
            </Flex>
          </CardBody>
        </Card>

      </SimpleGrid>
    </Box>
  );
};

export default LeadDetail;