import React from 'react';
import {
  Box, Container, Heading, Text, VStack, Button, SimpleGrid,
  Card, CardHeader, CardBody, Icon, Flex, Divider, Badge
} from '@chakra-ui/react';
import { FiArrowLeft, FiLogIn, FiUpload, FiBarChart2, FiPhoneCall, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GuideStep = ({ icon, title, steps }) => (
  <Card bg="gray.800" borderColor="gray.700" borderWidth={1} borderRadius="lg" h="full">
    <CardHeader pb={0}>
      <Flex align="center" gap={3}>
        <Flex w={10} h={10} align="center" justify="center" bg="green.900" borderRadius="full">
          <Icon as={icon} color="green.400" boxSize={5} />
        </Flex>
        <Heading size="md" color="white">{title}</Heading>
      </Flex>
    </CardHeader>
    <CardBody>
      <VStack align="start" spacing={3}>
        {steps.map((step, index) => (
          <Flex key={index} align="start" gap={3}>
            <Text color="green.400" fontWeight="bold" fontSize="sm">{index + 1}.</Text>
            <Text color="gray.400" fontSize="sm">{step}</Text>
          </Flex>
        ))}
      </VStack>
    </CardBody>
  </Card>
);

const Documentation = () => {
  return (
    <Box bg="gray.900" minH="100vh" py={10}>
      <Container maxW="container.xl">
        {/* Header */}
        <Button as={Link} to="/" leftIcon={<FiArrowLeft />} variant="ghost" mb={8} color="gray.400" _hover={{ color: 'green.400' }}>
          Kembali ke Beranda
        </Button>
        
        <Box mb={12} textAlign="center">
          <Heading
            size="2xl"
            mb={4}
            lineHeight="1.2"
            pb={1}
            bgGradient="linear(to-r, green.400, teal.300)"
            bgClip="text"
            >
            Panduan Pengguna
          </Heading>

          <Text color="gray.400" fontSize="lg" maxW="2xl" mx="auto">
            Pelajari cara menggunakan SmartConvert CRM untuk meningkatkan efisiensi penjualan dan memahami prioritas nasabah Anda.
          </Text>
        </Box>

        {/* Fitur Utama / Keunggulan */}
        <Box mb={12}>
          <Heading size="md" color="white" mb={6} borderLeft="4px solid" borderColor="green.400" pl={4}>
            Fitur Unggulan
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Box bg="gray.800" p={5} borderRadius="lg">
              <Heading size="sm" color="green.300" mb={2}>🎯 Prioritas Otomatis</Heading>
              <Text fontSize="sm" color="gray.400">Sistem otomatis memberi skor nasabah (High/Medium/Low) agar Anda tahu siapa yang harus dihubungi duluan.</Text>
            </Box>
            <Box bg="gray.800" p={5} borderRadius="lg">
              <Heading size="sm" color="green.300" mb={2}>💡 Rekomendasi Pintar</Heading>
              <Text fontSize="sm" color="gray.400">AI memberikan saran topik pembicaraan ("Next Best Conversation") berdasarkan profil nasabah.</Text>
            </Box>
            <Box bg="gray.800" p={5} borderRadius="lg">
              <Heading size="sm" color="green.300" mb={2}>⚡ Hemat Waktu</Heading>
              <Text fontSize="sm" color="gray.400">Upload ribuan data sekaligus dan dapatkan hasil analisis dalam hitungan detik.</Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Divider borderColor="gray.700" mb={12} />

        {/* Langkah Penggunaan */}
        <Heading size="md" color="white" mb={6} borderLeft="4px solid" borderColor="green.400" pl={4}>
          Cara Menggunakan Aplikasi
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <GuideStep 
            icon={FiLogIn}
            title="1. Login & Akses"
            steps={[
              "Masukkan Username dan Password yang diberikan oleh Admin IT.",
              "Pastikan Anda melihat halaman Dashboard Utama setelah berhasil login.",
              "Jika lupa password, segera hubungi supervisor Anda."
            ]}
          />
          <GuideStep 
            icon={FiUpload}
            title="2. Upload Data Nasabah"
            steps={[
              "Masuk ke menu 'Leads Data' di sidebar kiri.",
              "Klik tombol 'Upload CSV' di pojok kanan atas.",
              "Pilih file data nasabah (format .csv) dari komputer Anda.",
              "Tunggu notifikasi 'Upload Berhasil'. Data akan otomatis muncul di tabel."
            ]}
          />
          <GuideStep 
            icon={FiBarChart2}
            title="3. Membaca Skor & Prioritas"
            steps={[
              "Lihat kolom 'Prediction' di tabel. Warna Hijau artinya nasabah 'High Potential'.",
              "Prioritaskan menghubungi nasabah dengan Label Hijau atau Kuning.",
              "Abaikan nasabah dengan Label Merah (Low Potential) untuk menghemat waktu."
            ]}
          />
          <GuideStep 
            icon={FiPhoneCall}
            title="4. Menghubungi Nasabah"
            steps={[
              "Klik tombol 'Detail' pada baris nama nasabah.",
              "Baca kotak 'AI Recommendation' untuk melihat saran cara membuka percakapan.",
              "Lihat grafik 'AI Analysis' untuk memahami faktor pendukung (batang hijau) nasabah tersebut.",
              "Setelah menelepon, catat hasilnya di kolom 'Sales Notes' dan klik Simpan."
            ]}
          />
        </SimpleGrid>

        <Box mt={16} textAlign="center" pt={10} borderTop="1px solid" borderColor="gray.800">
          <Text fontSize="sm" color="gray.500">
            SmartConvert CRM v1.0 — Didesain untuk efisiensi tim penjualan.
          </Text>
        </Box>

      </Container>
    </Box>
  );
};

export default Documentation;