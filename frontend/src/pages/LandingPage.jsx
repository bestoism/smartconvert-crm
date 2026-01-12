import React from 'react';
import {
  Box, Container, Heading, Text, Button, Stack, SimpleGrid, Icon, Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiShield, FiCpu, FiArrowRight, FiBook } from 'react-icons/fi';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack
      bg="gray.800"
      p={6}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.700"
      align={'start'}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', borderColor: 'green.400' }} // Hover jadi Hijau
    >
      <Flex
        w={10} h={10} align={'center'} justify={'center'}
        color={'white'} rounded={'full'} bg={'green.500'} mb={1} // Ikon Hijau
      >
        {icon}
      </Flex>
      <Text fontWeight={600} color="white">{title}</Text>
      <Text color={'gray.400'}>{text}</Text>
    </Stack>
  );
};

const LandingPage = () => {
  return (
    <Box bg="gray.900" minH="100vh">
      {/* --- HERO SECTION --- */}
      <Container maxW={'5xl'}>
        <Stack
          textAlign={'center'}
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          {/* Badge Kecil Hijau */}
          <Box
            px={3} py={1} rounded="full"
            bg="green.900" border="1px solid" borderColor="green.700"
          >
            <Text fontSize="sm" color="green.200" fontWeight="bold">
              🚀 New V2 Model: No Data Leakage
            </Text>
          </Box>

          {/* Judul Besar */}
          <Heading
            fontWeight={800}
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            lineHeight={'110%'}
            color="white"
          >
            SmartConvert <br />
            <Text as={'span'} color={'green.400'}> {/* Highlight Hijau */}
              AI-Powered CRM
            </Text>
          </Heading>

          {/* Deskripsi */}
          <Text color={'gray.400'} maxW={'3xl'} fontSize={'xl'}>
            Tingkatkan konversi penjualan deposito bank Anda dengan kekuatan Machine Learning. 
            Prediksi nasabah potensial secara akurat, transparan, dan efisien.
          </Text>

          {/* Tombol Aksi */}
          <Stack spacing={6} direction={'row'}>
            <Button
              as={Link} to="/login"
              rounded={'full'}
              px={8} py={6}
              colorScheme={'green'}
              bg={'green.500'}
              _hover={{ bg: 'green.600' }}
              rightIcon={<FiArrowRight />}
              fontSize="lg"
            >
              Login / Register
            </Button>
            <Button
              as={Link} to="/docs"
              rounded={'full'}
              px={8} py={6}
              variant="outline"
              colorScheme="green" // Outline Hijau
              leftIcon={<FiBook />}
              fontSize="lg"
              _hover={{ bg: 'whiteAlpha.100' }}
            >
              Documentation
            </Button>
          </Stack>
        </Stack>
      </Container>

      {/* --- FEATURES SECTION --- */}
      <Box bg="gray.900" py={10} borderTop="1px solid" borderColor="gray.800">
        <Container maxW={'6xl'}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={FiTrendingUp} w={5} h={5} />}
              title={'Predictive Scoring'}
              text={'Algoritma XGBoost yang memprioritaskan nasabah High Potential untuk efisiensi sales.'}
            />
            <Feature
              icon={<Icon as={FiCpu} w={5} h={5} />}
              title={'Explainable AI'}
              text={'Transparansi total dengan SHAP Values. Pahami alasan di balik setiap prediksi.'}
            />
            <Feature
              icon={<Icon as={FiShield} w={5} h={5} />}
              title={'Secure & Fast'}
              text={'Arsitektur Fullstack modern dengan keamanan JWT dan pemrosesan batch kilat.'}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* --- FOOTER SIMPLE --- */}
      <Box py={6} textAlign="center" borderTop="1px solid" borderColor="gray.800">
        <Text color="gray.500" fontSize="sm">
          Built with ❤️ by Ryan Besto Saragih (UNESA)
        </Text>
      </Box>
    </Box>
  );
};

export default LandingPage;