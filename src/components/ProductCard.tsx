import { Box, Typography, Rating, Paper, Stack, Chip, CardActions, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useCart } from './CartContext';
import type { Product } from './types/types';
import type { JoinedProduct } from '../api/indexedDB';
import { useNavigation } from './NavigationContext';
import { ShoppingBag, ShoppingCart, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { singleHyphenFormat } from '../api/helper';

// interface ProductCardProps {
//   product: Product;
// }

export default function ProductCard({ product }: { product: JoinedProduct }) {
  const { addToCart } = useCart();
  const { navigateToDetails } = useNavigation();
  const navigate = useNavigate();

  return (
    <Paper
      component={motion.div}
      whileHover={{ y: -6, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      elevation={0}
      sx={{
        aspectRatio: '2/4',
        p: 1.5,
        borderRadius: '16px',
        bgcolor: 'background.paper',
        border: '1px solid #f0f0f0',
        // height: '100%',
        // width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Square Cropped Image */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1 / 1', // Forces the square shape
          borderRadius: '12px',
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
        }}
      >
        <img
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover' // Crops the image to fill the square
          }}
        />
      </Box>

      {/* 2. Content Section */}
      {/* Stack is a Box with special flexp roperty and useful gap feature */}
      <Stack spacing={0.5} sx={{ mt: 1.5, flexGrow: 1 }}>
        {/* Price Tag */}
        {/* Typography is useful for scalable design, in which you only control the theme for font style */}
        <Typography variant="h6" color="primary.main" sx={{ fontWeight: "800", lineHeight: 1.2, fontSize: 16, }}>
          ${product.price.toFixed(2)}
        </Typography>

        {/* Product Name */}
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            fontWeight: "500",
            display: '-webkit-box',
            WebkitLineClamp: 2, // Limits to 2 lines then adds "..."
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '40px', // Keeps card heights consistent
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating value={product.rating} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>
            {product.rating}
          </Typography>
        </Box>

        {/* 3. Dedicated Action Strip */}
        <CardActions disableSpacing sx={{ p: 0, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Main Add to Cart Action */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => addToCart(product)}
            startIcon={<ShoppingCart sx={{ scale: '0.8' }} />}
            sx={{ 
              fontSize: 11, 
              fontWeight: 700, 
              py: 1.2,
              borderRadius: '8px',
              flexGrow: 1
            }}
          >
            Add to Cart
          </Button>

          {/* New Secondary Details View Trigger */}
          <Button
            color="inherit"
            onClick={() => {
              const formattedName = singleHyphenFormat(product.name)
              navigate(`/product/${product.id}--${formattedName}`)}}
            sx={{
              width: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              p: 1,
              transition: 'all 0.2s',
              fontSize: 12,
              mt: 0,
              '&:hover': {
                bgcolor: 'background.default',
                borderColor: 'text.primary',
                color: 'primary.main'
              }
            }}
            title="View Details"
          >
            Details
          </Button>
        </CardActions>

        {/* 1 Row Discount Offer */}
        <Box sx={{ mt: 'auto'}}>
          <Chip
            label={product.discount_label}
            size="medium"
            color="error"
            variant="filled" // "filled" makes the discount pop more
            sx={{
              fontWeight: 'bold',
              fontSize: '0.65rem',
              height: '20px',
              borderRadius: '6px'
            }}
          />
        </Box>
        {/* Tags */}
        <Box sx={{ mt: 'auto' }}>
          {product.tags?.map((item) => 
          <Chip
          label={item}
          size="medium"
          // color="error"
          variant="filled" // "filled" makes the discount pop more
          sx={{
            fontWeight: 'bold',
            fontSize: '0.65rem',
            height: '20px',
            borderRadius: '6px',
            border: '1px solid',
            borderColor: 'hsl(201, 54%, 61%)',
            bgcolor: 'hsl(201, 100%, 91%)',
            color: 'hsl(201, 50%, 45%)',
          }}
          />
        )}
        </Box>
      </Stack>
    </Paper>
  );
}