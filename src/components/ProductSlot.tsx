import { Box, Skeleton } from '@mui/material'; // Using Grid2 for the latest standard
import Grid from '@mui/material/Grid'; // Standard import
import React from 'react';
import type { JoinedProduct } from '../api/indexedDB';
import ProductCard from './ProductCard';

interface ProductSlotProps {
  children?: React.ReactNode;
  loading: boolean;
  product: JoinedProduct | undefined;
}

export default function ProductSlot({loading, product }: ProductSlotProps){

  return (
    // No "item" prop here! We just define the columns.
    <Grid size={{xs: 6,  sm: 4, md: 3 }}> 
      <Box
        sx={{
          // width: '100%',
          aspectRatio: '2 / 4',
          position: 'relative',
          //   bgColor: 'blue',
        }}
      >
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />
        ) : product ? (
          <ProductCard product={product} />
        ) : (
          // Reserved empty space for partial last pages
          <Box sx={{ height: '100%', width: '100%', }} />
        )}
      </Box>
    </Grid>
  );
};