import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'

// 1. Setup Dark Mode Config
const config = {
  initialColorMode: 'dark', // Default langsung Gelap biar keren
  useSystemColorMode: false,
}

// 2. Extend Theme
const theme = extendTheme({ config })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Penting buat Dark Mode */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)