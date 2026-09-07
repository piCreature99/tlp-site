import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CssBaseline } from "@mui/material";
import { CartProvider } from "./components/CartContext.tsx";
import { theme } from "./themes/theme.ts";
import { MetadataProvider } from "./components/MetadataProvider.tsx";
import { LocalProductProvider } from "./components/LocalProductProvider.tsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./components/AuthContext.tsx";
import { NavigationProvider } from "./components/NavigationContext.tsx";
// import { LocalProductProvider } from "./components/LocalProductProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <GoogleOAuthProvider clientId="426710001132-9vm96ldtl9dpl11upsvnii0tta04bvrt.apps.googleusercontent.com"
      // useFedCM={false} // <--- Add this property here
      // {...({ useFedCM: false } as any)}
      >
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalProductProvider>
              <MetadataProvider>
                <CartProvider>
                  <NavigationProvider>


                    <App />
                  </NavigationProvider>
                </CartProvider>
              </MetadataProvider>
            </LocalProductProvider>
          </ThemeProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </StrictMode>,
  </BrowserRouter>
)
