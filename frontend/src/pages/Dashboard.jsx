import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Flex,
  Icon,
  Spinner,
  Center,
  Text
} from '@chakra-ui/react';
import {
  FiUsers,
  FiTrendingUp,
  FiActivity,
  FiAlertCircle
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Sector,
  Legend
} from 'recharts';
import api from '../api';

/* =========================
   1. Warna Palette Konstan
========================= */
const COLORS_EDU = ['#6366F1', '#8B5CF6', '#D946EF', '#06B6D4', '#10B981'];
const COLORS_MARITAL = ['#F472B6', '#FB923C', '#2DD4BF', '#FBBF24', '#A855F7'];

/* =========================
   2. Reusable Custom Tooltip (Glassmorphism)
========================= */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        bg="rgba(26, 32, 44, 0.85)"
        px={4}
        py={2}
        border="1px solid"
        borderColor="whiteAlpha.300"
        backdropFilter="blur(10px)"
        borderRadius="md"
        boxShadow="2xl"
      >
        <Text color="gray.400" fontSize="xs" fontWeight="bold" mb={1} textTransform="uppercase">
          {label || payload[0].name}
        </Text>
        <Text color="white" fontSize="sm" fontWeight="bold">
          Total: <Text as="span" color="green.400">{payload[0].value.toLocaleString()}</Text>
        </Text>
      </Box>
    );
  }
  return null;
};

/* =========================
   3. SVG Gradients Definitions
========================= */
const ChartGradients = () => (
  <svg style={{ height: 0, width: 0, position: 'absolute' }}>
    <defs>
      <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#48BB78" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#48BB78" stopOpacity={0.1}/>
      </linearGradient>
      <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4299E1" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#4299E1" stopOpacity={0.1}/>
      </linearGradient>
    </defs>
  </svg>
);

/* =========================
   4. Active Shape for Interactive Donut
========================= */
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={-8} textAnchor="middle" fill="white" fontSize="12px" fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={12} textAnchor="middle" fill="gray.400" fontSize="11px">
        {value} Leads
      </text>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

/* =========================
   Reusable Stat Card
========================= */
const StatCard = ({ label, value, helpText, icon, color }) => (
  <Card 
    bg="gray.800" 
    borderLeft="4px solid" 
    borderColor={color}
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-4px)', boxShadow: 'dark-lg' }}
  >
    <CardBody>
      <Flex alignItems="center">
        <Box p={3} bg="whiteAlpha.50" borderRadius="lg" mr={4}>
          <Icon as={icon} boxSize={6} color={color} />
        </Box>
        <Stat>
          <StatLabel color="gray.500" fontWeight="bold" textTransform="uppercase" fontSize="xs" letterSpacing="widest">
            {label}
          </StatLabel>
          <StatNumber fontSize="3xl" color="white" fontWeight="bold">
            {value}
          </StatNumber>
          {helpText && <StatHelpText mb={0} color="gray.500" fontSize="xs">{helpText}</StatHelpText>}
        </Stat>
      </Flex>
    </CardBody>
  </Card>
);

/* =========================
   Dashboard Component
========================= */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeEdu, setActiveEdu] = useState(0);
  const [activeMarital, setActiveMarital] = useState(0);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Gagal mengambil data stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Center h="100vh" bg="gray.900">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="green.400" />
      </Center>
    );
  }

  return (
    <Box 
      bg="gray.900" 
        minH="100vh" 
        p={{ base: 4, md: 8 }} 
        w="full"
      >
      <ChartGradients />
      
      <Box mb={8}>
        <Text color="green.400" fontWeight="bold" fontSize="xs" mb={1} letterSpacing="widest">
          DATA ANALYTICS ENGINE v1.0
        </Text>
        <Heading size="lg" color="white">Advanced Business Insights</Heading>
      </Box>

      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard label="Total Leads" value={stats?.total_leads || 0} icon={FiUsers} color="blue.400" />
        <StatCard label="High Potential" value={stats?.high_potential || 0} helpText="Ready to call" icon={FiTrendingUp} color="green.400" />
        <StatCard label="Medium Potential" value={stats?.medium_potential || 0} icon={FiActivity} color="yellow.400" />
        <StatCard label="Low Potential" value={stats?.low_potential || 0} icon={FiAlertCircle} color="red.400" />
      </SimpleGrid>

      {/* Main Charts Row */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <Card bg="gray.800" borderRadius="xl" p={6}>
          <Heading size="sm" mb={6} color="gray.100" fontWeight="medium">AI Prediction Confidence Score</Heading>
          <Box h="300px">
            <ResponsiveContainer>
              <BarChart data={stats?.score_dist}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2D3748" />
                <XAxis dataKey="name" stroke="#718096" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'white', opacity: 0.05 }} />
                <Bar dataKey="value" fill="url(#gradientGreen)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        <Card bg="gray.800" borderRadius="xl" p={6}>
          <Heading size="sm" mb={6} color="gray.100" fontWeight="medium">Job Distribution Ranking</Heading>
          <Box h="300px">
            <ResponsiveContainer>
              <BarChart data={stats?.job_dist} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2D3748" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#A0AEC0' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="url(#gradientBlue)" radius={[0, 4, 4, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </SimpleGrid>

      {/* Demographics Row */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
        {/* Age Groups */}
        <Card bg="gray.800" borderRadius="xl" p={5}>
          <Text color="gray.500" fontSize="xs" fontWeight="bold" mb={4} textTransform="uppercase">Age Groups</Text>
          <Box h="280px">
            <ResponsiveContainer>
              <BarChart data={stats?.age_dist}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#718096' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#ECC94B" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Education (Indigo/Teal Palette) */}
        <Card bg="gray.800" borderRadius="xl" p={5}>
          <Text color="gray.500" fontSize="xs" fontWeight="bold" mb={4} textTransform="uppercase">Education Level</Text>
          <Box h="280px">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeEdu}
                  activeShape={renderActiveShape}
                  data={stats?.edu_dist}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveEdu(index)}
                >
                  {stats?.edu_dist?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_EDU[index % COLORS_EDU.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>

        {/* Marital Status (Pink/Orange Palette) */}
        <Card bg="gray.800" borderRadius="xl" p={5}>
          <Text color="gray.500" fontSize="xs" fontWeight="bold" mb={4} textTransform="uppercase">Marital Status</Text>
          <Box h="280px">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  activeIndex={activeMarital}
                  activeShape={renderActiveShape}
                  data={stats?.marital_dist}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveMarital(index)}
                >
                  {stats?.marital_dist?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_MARITAL[index % COLORS_MARITAL.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </SimpleGrid>

      {/* Economic Context */}
      <Card bg="gray.800" borderRadius="xl" borderTop="4px solid" borderColor="orange.400">
        <CardBody p={8}>
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
            <Box mb={{ base: 6, md: 0 }}>
              <Heading size="md" color="white" mb={2}>Economic Context</Heading>
              <Text color="gray.500" fontSize="sm">Euribor 3M Index Distribution</Text>
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={12}>
              {stats?.econ_dist?.map(item => (
                <Box key={item.name} textAlign="center">
                  <Text color="gray.500" fontSize="xs" fontWeight="bold" mb={1} textTransform="uppercase">{item.name}</Text>
                  <Text color="orange.300" fontWeight="bold" fontSize="2xl">{item.value}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Dashboard;