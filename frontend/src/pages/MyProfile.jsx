import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  Divider,
  Progress,
  VStack,
  HStack,
  Spinner,
  Center,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

import {
  FiMail,
  FiCalendar,
  FiTarget,
  FiAward,
  FiBarChart2,
  FiClock,
  FiEdit3,
  FiTrendingUp,
  FiChevronRight,
  FiExternalLink
} from 'react-icons/fi';

import { Link as RouterLink } from 'react-router-dom';
import api from '../api';


const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdate = async () => {
    try {
      await api.put('/user/profile', formData);
      toast({ title: "Profile Updated", status: "success" });
      fetchProfile();
      onClose();
    } catch (error) { toast({ title: "Update Failed", status: "error" }); }
  };

  if (loading) return <Center h="80vh"><Spinner size="xl" color="green.400" /></Center>;

  return (
    <Box p={8} bg="gray.900" minH="100vh">
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg" color="white">My Profile</Heading>
        <Button leftIcon={<FiEdit3 />} variant="primary" onClick={onOpen}>Edit Profile</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
        {/* IDENTITAS */}
        <Card bg="gray.800" borderRadius="2xl" p={6}>
          <CardBody textAlign="center">
            <VStack spacing={4}>
              <Avatar size="2xl" name={profile.name} border="4px solid" borderColor="green.400" />
              <Box>
                <Heading size="md" color="white">{profile.name}</Heading>
                <Text color="green.400" fontSize="sm" fontWeight="bold">{profile.role}</Text>
              </Box>
              <Divider borderColor="gray.700" />
              <VStack align="stretch" w="full" spacing={4}>
                <HStack><Icon as={FiAward} color="green.400" /><Text color="white">{profile.id_emp}</Text></HStack>
                <HStack><Icon as={FiMail} color="green.400" /><Text color="white" fontSize="sm">{profile.email}</Text></HStack>
                <HStack><Icon as={FiCalendar} color="green.400" /><Text color="white">{profile.joined_date}</Text></HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* STATS & ACTIVITY */}
        <VStack spacing={8} gridColumn={{ lg: "span 2" }} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <StatBox icon={FiBarChart2} label="Processed" value={profile.stats.leads_processed} color="blue.400" />
            <StatBox icon={FiTrendingUp} label="Conv. Rate" value={`${profile.stats.conversion_rate}%`} color="green.400" />
            <StatBox icon={FiClock} label="Active Days" value={`${profile.active_days} Days`} color="orange.400" />
          </SimpleGrid>

          <Card bg="gray.800" borderRadius="2xl">
            <CardBody p={8}>
              <Flex justify="space-between" mb={4}>
                <Heading size="sm" color="white">Monthly Sales Target</Heading>
                <Text color="red.400" fontWeight="bold">{profile.stats.current_progress} / {profile.monthly_target}</Text>
              </Flex>
              <Progress value={(profile.stats.current_progress / profile.monthly_target) * 100} colorScheme="red" borderRadius="full" size="lg" bg="gray.700" />
            </CardBody>
          </Card>

          <Card bg="gray.800" borderRadius="2xl">
            <CardBody>
                <Heading size="sm" color="white" mb={4}>Live Activity Logs</Heading>
                    <VStack align="stretch" spacing={3}>
                    {profile.recent_activities.map((act, i) => (
                     <Flex
          key={i}
          p={3}
          bg="whiteAlpha.50"
          borderRadius="md"
          borderLeft="3px solid"
          borderColor="green.400"
          align="center"
          justify="space-between"
          transition="0.2s"
          _hover={{ bg: "whiteAlpha.100" }} // Efek hover biar terasa interaktif
        >
          <Box>
            <Text fontSize="10px" color="gray.500">{act.time}</Text>
            <Text color="white" fontSize="xs">{act.content}</Text>
          </Box>

          {/* TOMBOL PANAH BARU */}
          <IconButton
            as={RouterLink}
            to={`/leads/${act.lead_id}`}
            icon={<FiChevronRight />}
            size="sm"
            variant="ghost"
            colorScheme="green"
            aria-label="View Detail"
            _hover={{ transform: "translateX(3px)" }} // Animasi panah gerak sedikit
          />
        </Flex>
      ))}
                    </VStack>
                </CardBody>
            </Card>
        </VStack>
      </SimpleGrid>

      {/* MODAL EDIT */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Update Profile</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl><FormLabel fontSize="xs">Name</FormLabel>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </FormControl>
              <FormControl><FormLabel fontSize="xs">Role</FormLabel>
                <Input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
              </FormControl>
              <FormControl><FormLabel fontSize="xs">Monthly Target</FormLabel>
                <Input type="number" value={formData.monthly_target} onChange={(e) => setFormData({...formData, monthly_target: e.target.value})} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="green" onClick={handleUpdate}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const StatBox = ({ icon, label, value, color }) => (
  <Card bg="gray.800" borderRadius="xl">
    <CardBody>
      <HStack><Icon as={icon} color={color} /><Text color="gray.400" fontSize="xs">{label}</Text></HStack>
      <Heading size="lg" color="white" mt={2}>{value}</Heading>
    </CardBody>
  </Card>
);

export default MyProfile;