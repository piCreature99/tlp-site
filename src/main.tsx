import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline } from "@mui/material";
import { CartProvider } from "./components/CartContext.tsx";
import { theme } from "./themes/theme.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>

        <App />
      </CartProvider>
    </ThemeProvider>
  </StrictMode>,
)
