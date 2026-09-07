import {
  CreditCard,
  LocalShipping,
  Logout,
  Person,
  Settings,
  ShoppingCart,
  VerifiedUser
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Unified v6 import channel
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Cart from './Cart';
import { useCart } from './CartContext';
import OrderManagementPage from './OrderManagementPage';

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'cart'>('profile');
  const { user, 
    // isAuthenticated, loading, logout 
  } = useAuth();
  const {cart} = useCart();
  const {state} = useLocation();
  // console.log(user);

  useEffect(() => {
    if(state?.cart === 'cart'){
      setActiveTab('cart');
    }
  }, [state])

  // const [userInfo, setUserInfo] = useState<UserProfile | null>(
//     {
//     firstName: "Sarah",
//     lastName: "Jenkins",
//     email: "s.jenkins@example.com",
//     phone: "+1 (555) 234-5678",
//     tier: "Platinum Appliance Elite Member",
//     joinDate: "Member since October 2024"
//   }
// );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1440px', mx: 'auto', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Grid container spacing={4}>
        
        {/* 🪪 LEFT COLUMN: USER AVATAR & SIDEBAR NAVIGATION */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Stack spacing={3}>
            {/* User Info Card */}
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                  src={user?.picture}
                  alt={`${user?.display_name}`}
                  sx={{ width: 90, height: 90, border: '3px solid', borderColor: 'primary.main', boxShadow: 1 }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                {user?.display_name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, mb: 2 }}>
                {user?.created_at}
              </Typography>
              <Chip 
                label={user?.role} 
                color="primary" 
                size="small" 
                variant="outlined"
                icon={<VerifiedUser fontSize="small" />}
                sx={{ fontWeight: 700, borderRadius: 1.5, fontSize: '0.75rem', py: 1.5 }}
              />
            </Paper>

            {/* Sidebar Navigation Links */}
            <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')}
                  >
                    <ListItemIcon><Person color={activeTab === 'profile' ? 'primary' : 'inherit'} /></ListItemIcon>
                    <ListItemText primary="Account Profile" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeTab === 'orders'} 
                    onClick={() => setActiveTab('orders')}
                  >
                    <ListItemIcon><LocalShipping color={activeTab === 'orders' ? 'primary' : 'inherit'} /></ListItemIcon>
                    <ListItemText primary="My Orders" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton 
                    selected={activeTab === 'cart'} 
                    onClick={() => setActiveTab('cart')}
                  >
                    <ListItemIcon><ShoppingCart color={activeTab === 'cart' ? 'primary' : 'inherit'} /></ListItemIcon>
                    <ListItemText primary="My Cart" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton disabled>
                    <ListItemIcon><CreditCard /></ListItemIcon>
                    <ListItemText primary="Billing Details" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton disabled>
                    <ListItemIcon><Settings /></ListItemIcon>
                    <ListItemText primary="Security Settings" />
                  </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem disablePadding>
                  <ListItemButton sx={{ color: 'error.main' }}>
                    <ListItemIcon><Logout color="error" /></ListItemIcon>
                    <ListItemText primary="Sign Out"/>
                  </ListItemButton>
                </ListItem>
              </List>
            </Paper>
          </Stack>
        </Grid>

        {/* 🎬 RIGHT COLUMN: MOTION WORKSPACE STAGE */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              /* 👤 PANEL A: PERSONAL ACCOUNT CONFIGURATIONS */
              <Box
                component={motion.div}
                key="profile-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, minHeight: '450px' }}>
                  <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2, mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                      Profile Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Update your contact parameters and default distribution delivery channels.
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        label="Display Name" 
                        value={user?.name} 
                        // onChange={(e) => {}}
                        fullWidth 
                        size="small" 
                      />
                    </Grid>
                    {/* <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        label="Last Name" 
                        value={userInfo.lastName} 
                        onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                        fullWidth 
                        size="small" 
                      />
                    </Grid> */}
                    <Grid size={12}>
                      <TextField 
                        label="Email Address" 
                        value={user?.email} 
                        disabled 
                        fullWidth 
                        size="small" 
                        slotProps={{
                          formHelperText: { sx: { fontWeight: 500 } }
                        }}
                        helperText="Primary account routing email cannot be edited independently."
                      />
                    </Grid>
                    {/* <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField 
                        label="Phone Number" 
                        value={userInfo.phone} 
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        fullWidth 
                        size="small" 
                      />
                    </Grid> */}
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'end', pt: 4, mt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ fontWeight: 700, borderRadius: 2, textTransform: 'none', px: 4 }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Paper>
              </Box>
            ) : activeTab === 'cart' ? (
                <Box
                component={motion.div}
                key="cart-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Cart items={cart} />
              </Box>
            ) : (
              /* 🗄️ PANEL B: RENDER ORDER MANAGEMENT COMPONENT WITH MOTION UNMOUNTING */
              <Box
                component={motion.div}
                key="orders-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <OrderManagementPage />
              </Box>
            )}
          </AnimatePresence>
        </Grid>

      </Grid>
    </Box>
  );
}