import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // ✅ IMPORT ADDED
import { CartProvider } from './context/CartContext.jsx'
import './index.css'
import App from './App.jsx'
import { CssBaseline, ThemeProvider } from '@mui/material'
import muiTheme from './theme/muiTheme.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
