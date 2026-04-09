import { Box, Typography, Rating, Paper, Stack, Chip, CardActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useCart } from './CartContext';

// Typescript interface for our product data
interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  discount:  string;
}

// interface ProductCardProps {
//   product: Product;
// }

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Paper
      component={motion.div}
      whileHover={{ y: -6, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: '16px',
        bgcolor: 'background.paper',
        border: '1px solid #f0f0f0',
        height: '100%',
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
          src={product.image}
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
        <Typography variant="h6"  color="primary.main" sx={{ fontWeight: "800", lineHeight: 1.2, }}>
          {product.price}
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
          <Typography variant="caption" color="text.secondary" sx={{fontWeight: "bold"}}>
            {product.rating}
          </Typography>
        </Box>

        <CardActions>
          <Button
            variant="contained"
            fullWidth
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </Button>
        </CardActions>

        {/* 1 Row Discount Offer */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Chip
            label={product.discount}
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
      </Stack>
    </Paper>
  );
}