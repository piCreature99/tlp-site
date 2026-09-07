import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Rating, 
  Chip, 
  Divider, 
  IconButton, 
  Stack, 
  Paper, 
  Skeleton,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder, 
  LocalShipping, 
  Shield, 
  NavigateNext, 
  Build, 
  WorkspacePremium,
  EventAvailable
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import { useLocalProducts } from '../context/LocalProductContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`specs-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProductPage() {
  const { idAndSlug } = useParams<{ idAndSlug: string }>();
  const navigate = useNavigate(); 
  const { getProductById } = useLocalProducts(); 
  
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  
  // Appliance-Specific Protection & Service upsell variables
  const [protectionPlan, setProtectionPlan] = useState<string | null>(null);
  const [includeInstallation, setIncludeInstallation] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!idAndSlug) return;
      setLoading(true);
      try {
        const data = await getProductById(idAndSlug);
        if (data) {
          setProduct(data);
          setSelectedImage(data.image_url || '');
        }
      } catch (err) {
        console.error("Failed to load appliance data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [idAndSlug, getProductById]);

  if (loading) return <ProductPageSkeleton />;
  if (!product) return <ProductNotFoundState onBack={() => navigate('/')} />;

  // Multi-angle imagery fallbacks typical of appliance inspection frames
  const imageGallery = [product.image_url, product.image_url, product.image_url].filter(Boolean);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      
      {/* 🧭 INDUSTRY-STANDARD APPLIANCE BREADCRUMBS */}
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 4, bgcolor: 'background.default', py: 1 }}
      >
        <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ fontWeight: 500 }}>
          Home
        </Link>
        <Link 
          component={RouterLink} 
          to={`/?category=${product.category_slug}`} 
          color="inherit" 
          underline="hover"
          sx={{ fontWeight: 500 }}
        >
          {product.category_name || "Appliances"}
        </Link>
        <Typography color="text.primary" noWrap={true} sx={{ fontWeight: 600, maxWidth: 250  }}>
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 4, lg: 6 }}>
        
        {/* LEFT PANEL: Professional Media Gallery Stage */}
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Paper
              variant="outlined"
              sx={{ 
                width: '100%', 
                overflow: 'hidden', 
                bgcolor: '#fff',
                aspectRatio: '1/1', // Clean square framing used by major appliance retailers
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                borderRadius: 2
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                />
              </AnimatePresence>
            </Paper>

            {/* Thumbnail Navigation Array */}
            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
              {imageGallery.map((img, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  onClick={() => setSelectedImage(img)}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0.5,
                    bgcolor: '#fff',
                    borderColor: selectedImage === img ? 'primary.main' : 'divider',
                    borderWidth: selectedImage === img ? 2 : 1,
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1, borderColor: 'primary.light' }
                  }}
                >
                  <img src={img} alt={`View ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </Paper>
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* RIGHT PANEL: Commercial Transactional & Spec Engine */}
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <Stack spacing={3}>
            
            {/* Brand Header & Product Title */}
            <Box>
              <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: 'center', }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'primary.main', letterSpacing: 1 }}>
                  {product.brand_name || 'Premium Series'}
                </Typography>
                <Chip label={`Model: ${product.id?.toString().substring(0, 8) || 'N/A'}`} size="small" variant="outlined" sx={{ borderRadius: 1, fontWeight: 600 }} />
              </Stack>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                {product.name}
              </Typography>
            </Box>

            {/* Ratings & Stock Availability Indicators */}
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', }} divider={<Divider orientation="vertical" flexItem />}>
              <Stack direction="row" sx={{ alignItems: 'center', }} spacing={0.5}>
                <Rating value={product.rating || 4.5} precision={0.5} readOnly size="small" />
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {product.rating || 4.5}
                </Typography>
              </Stack>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 700, 
                  color: product.stock_count > 0 ? 'success.main' : 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <EventAvailable fontSize="small" />
                {product.stock_count > 0 ? `In Stock (Ready to Ship)` : 'Backorder - Leaves warehouse in 2-3 weeks'}
              </Typography>
            </Stack>

            <Divider />

            {/* Pricing Section */}
            <Box>
              <Stack direction="row" sx={{alignItems: 'baseline', }} spacing={2}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary' }}>
                  ${product.price?.toFixed(2)}
                </Typography>
                {product.discount_label && (
                  <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                    ${(product.price * 1.15).toFixed(2)}
                  </Typography>
                )}
              </Stack>
              {product.discount_label && (
                <Chip label={`SAVE 15% - ${product.discount_label}`} color="error" size="small" sx={{ fontWeight: 700, mt: 1, borderRadius: 1 }} />
              )}
            </Box>

            {/* 🛡️ APPLIANCE UPSELL MODULE 1: Protection Plans */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, bgcolor: 'background.default' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkspacePremium color="primary" fontSize="small" />
                Add Protection Plan
              </Typography>
              <Stack spacing={1}>
                {[
                  { id: '3year', label: '3-Year Major Appliance Care Plan', price: 89.99 },
                  { id: '5year', label: '5-Year Extended Commercial Warranty', price: 149.99 }
                ].map((plan) => (
                  <Button
                    key={plan.id}
                    variant={protectionPlan === plan.id ? 'contained' : 'outlined'}
                    color={protectionPlan === plan.id ? 'primary' : 'inherit'}
                    onClick={() => setProtectionPlan(protectionPlan === plan.id ? null : plan.id)}
                    fullWidth
                    sx={{ 
                      justifyContent: 'space-between', 
                      p: 1.5, 
                      textAlign: 'left',
                      textTransform: 'none',
                      borderColor: 'divider',
                      bgcolor: protectionPlan === plan.id ? 'primary.main' : '#fff'
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{plan.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>+${plan.price}</Typography>
                  </Button>
                ))}
              </Stack>
            </Paper>

            {/* 🛠️ APPLIANCE UPSELL MODULE 2: Delivery & Specialized Installation */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={includeInstallation} 
                    onChange={(e) => setIncludeInstallation(e.target.checked)} 
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Build fontSize="inherit" /> Professional Installation & Haul-Away
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Unbox, level, test connection, and recycle your old appliance (+$49.99)
                    </Typography>
                  </Box>
                }
              />
            </Paper>

            {/* Core Add to Cart Transactional Trigger Area */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                disabled={product.stock_count === 0}
                sx={{ py: 2, fontWeight: 800, fontSize: '1.05rem', boxShadow: 'none', borderRadius: 2 }}
              >
                Add to Cart
              </Button>
              
              <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <IconButton 
                  onClick={() => setIsWishlist(!isWishlist)}
                  sx={{ p: 2, height: '100%', color: isWishlist ? 'error.main' : 'text.secondary' }}
                >
                  {isWishlist ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Paper>
            </Stack>

            {/* Value Logistics Badges */}
            <Stack spacing={2} sx={{ bgcolor: 'background.default', p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={2} sx={{alignItems: 'flex-start', }}>
                <LocalShipping color="action" sx={{ mt: 0.3 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Free Curbside Delivery</Typography>
                  <Typography variant="caption" color="text.secondary">Scheduled freight arrival managed directly with local logistics hubs.</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} sx={{alignItems: 'flex-start', }}>
                <Shield color="action" sx={{ mt: 0.3 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Secure Purchase & Extended Support</Typography>
                  <Typography variant="caption" color="text.secondary">Verified checkout encryption. 30-day structural component return option included.</Typography>
                </Box>
              </Stack>
            </Stack>

          </Stack>
        </Grid>
      </Grid>

      {/* 📊 LOWER CONTENT MODULE: Deep Technical Appliance Overview Specification Tabs */}
      <Box sx={{ width: '100%', mt: 8 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Product specifications tabs" variant="scrollable" scrollButtons="auto">
            <Tab label="Product Overview" sx={{ fontWeight: 700, px: 3 }} />
            <Tab label="Full Specifications" sx={{ fontWeight: 700, px: 3 }} />
            <Tab label="Installation & Guides" sx={{ fontWeight: 700, px: 3 }} />
          </Tabs>
        </Box>
        
        {/* Tab Panel 1: Descriptive Overview */}
        <CustomTabPanel value={activeTab} index={0}>
          <Grid container spacing={4}>
            <Grid size={{xs: 12, md: 8}}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Features & Description</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3 }}>
                {product.description || "This premium home appliance offers advanced efficiency controls and an optimized build pattern. Engineered to fit seamlessly into modern configurations, it ensures reliable long-term performance backed by our local synchronization indices."}
              </Typography>
              {product.tags && product.tags.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Key Classifications:</Typography>
                  <Stack direction="row" spacing={1} sx= {{flexWrap: "wrap"}} useFlexGap>
                    {product.tags.map((tag: string) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>
          </Grid>
        </CustomTabPanel>
        
        {/* Tab Panel 2: Technical Specification Sheet Table */}
        <CustomTabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Technical Document Matrix</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, maxWidth: 800 }}>
            <Table aria-label="detailed appliance specifications">
              <TableBody>
                {[
                  { name: 'Brand Manufacturer', value: product.brand_name || 'Standard Series' },
                  { name: 'Hardware Catalog Key', value: product.id || 'N/A' },
                  { name: 'Associated Category Group', value: product.category_name || 'General Appliance' },
                  { name: 'Electrical Power Requirements', value: '110-120V / 60 Hz Standard Outlets' },
                  { name: 'Energy Certification Rating', value: 'Energy Star Certified High-Efficiency' },
                  { name: 'Warranty Protection Framework', value: '1-Year Parts and Labor Base Coverage' }
                ].map((row, idx) => (
                  <TableRow key={row.name} sx={{ bgcolor: idx % 2 === 0 ? 'background.default' : '#fff' }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 700, width: '40%', borderColor: 'divider' }}>
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ borderColor: 'divider', color: 'text.secondary' }}>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
        
        {/* Tab Panel 3: Installation and Logistics Preparation Checklist */}
        <CustomTabPanel value={activeTab} index={2}>
          <Stack spacing={2} sx={{ maxWidth: 800 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Pre-Delivery Fit Checklist</Typography>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Please measure your delivery access hallways, door frames, and counter alcoves before delivery agents arrive to verify fit profile parameters.
            </Alert>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
              If you opted for our <strong>Professional Installation Service</strong>, make sure the installation area is completely clear of debris and has access points matching standard appliance fittings. If connections require replacement valves or specialized mounting adapters, those should be staged at the location prior to driver arrival.
            </Typography>
          </Stack>
        </CustomTabPanel>
      </Box>

    </Container>
  );
}

/* 💀 SKELETON DISPLAY STATE */
function ProductPageSkeleton() {
  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Skeleton variant="text" width="20%" height={30} sx={{ mb: 4 }} />
      <Grid container spacing={4}>
        <Grid size={{xs: 12, md: 6, lg: 7}}>
          <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '1/1', borderRadius: '12px' }} />
        </Grid>
        <Grid size={{xs: 12, md: 6, lg: 5}}>
          <Stack spacing={3}>
            <Skeleton variant="text" height={30} width="30%" />
            <Skeleton variant="text" height={60} width="90%" />
            <Skeleton variant="text" height={30} width="40%" />
            <Divider />
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={55} sx={{ borderRadius: 2 }} />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

/* ❌ NOT FOUND DISPLAY STATE */
function ProductNotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>Item Unresolvable</Typography>
      <Typography color="text.secondary">
        We found your parameter segment, but the product record could not be extracted from the local database context.
      </Typography>
      <Button variant="contained" onClick={onBack} sx={{ mt: 2, fontWeight: 700, borderRadius: 2, px: 4, py: 1.5 }}>
        Return to Dashboard
      </Button>
    </Container>
  );
}