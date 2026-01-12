import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'

// --- 1. Inject Font (Plus Jakarta Sans) ---
const fontLink = document.createElement('link');
fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// --- 2. Konfigurasi Tema ---
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,

  // A. Typography
  fonts: {
    heading: `'Plus Jakarta Sans', sans-serif`,
    body: `'Plus Jakarta Sans', sans-serif`,
  },

  // B. Color Palette
  colors: {
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    blue: {
      400: '#38BDF8',
      500: '#0EA5E9',
      600: '#0284C7',
    },
    green: {
      400: '#34D399',
      500: '#10B981',
    }
  },

  // ✅ Semantic Tokens (Best Practice SaaS)
  semanticTokens: {
    colors: {
      bgPrimary: 'gray.900',
      bgSecondary: 'gray.800',
      borderPrimary: 'gray.700',
      textMuted: 'gray.400',
    }
  },

  // C. Global Styles
  styles: {
    global: {
      body: {
        bg: 'bgPrimary',
        color: 'gray.100',
        lineHeight: '1.6',
      },
      '*': {
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }
    },
  },

  // D. Components
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '6px', // lebih korporat
      },
      variants: {
        primary: {
          bg: 'blue.500',
          color: 'white',
          _hover: { bg: 'blue.600' },
          _active: { bg: 'blue.600' },
        }
      }
    },

    Card: {
      baseStyle: {
        container: {
          bg: 'bgSecondary',
          borderRadius: '8px', // dari 12px → lebih elegan
          border: '1px solid',
          borderColor: 'borderPrimary',
          boxShadow: 'sm',
        },
      },
    },

    Input: {
      defaultProps: {
        focusBorderColor: 'blue.400',
      },
      variants: {
        filled: {
          field: {
            bg: 'gray.800',
            borderRadius: '6px',
            _hover: { bg: 'gray.700' },
            _focus: { bg: 'gray.700', borderColor: 'blue.400' }
          }
        },
        outline: {
          field: {
            borderRadius: '6px',
            borderColor: 'gray.600',
          }
        }
      }
    },

    Badge: {
      baseStyle: {
        borderRadius: '4px',
        padding: '0 8px',
        textTransform: 'capitalize',
        fontWeight: '600',
      }
    },

    Stat: {
      baseStyle: {
        label: {
          fontWeight: '500',
          color: 'textMuted',
        },
        number: {
          fontWeight: '700',
          letterSpacing: '-0.02em',
        }
      }
    },

    // ✅ Table styling (Dashboard wajib)
    Table: {
      baseStyle: {
        th: {
          color: 'textMuted',
          fontWeight: '600',
          borderColor: 'borderPrimary',
        },
        td: {
          borderColor: 'borderPrimary',
        }
      }
    }
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
