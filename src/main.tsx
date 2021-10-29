import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './theme'
import './i18n'
import Overlay from './components/overlay'

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
      <Overlay />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
