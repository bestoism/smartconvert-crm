import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'

function App() {
  return (
    <Box textAlign="center" fontSize="xl" mt={10}>
      <VStack spacing={8}>
        <Heading>SmartConvert CRM 🚀</Heading>
        <Text>Frontend React sudah siap dikembangkan!</Text>
        <Button colorScheme="green" size="lg">
          Test Button Chakra UI
        </Button>
      </VStack>
    </Box>
  )
}

export default App