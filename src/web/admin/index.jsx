
import React from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'

import './index.css'
import CordiallyAdmin from './CordiallyAdmin'

ReactDOM.render(
  <React.StrictMode>
      <ChakraProvider>
          <CordiallyAdmin />
      </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

