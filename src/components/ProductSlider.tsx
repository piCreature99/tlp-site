import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: "$99", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
  { id: 2, name: "Smart Watch", price: "$199", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
  { id: 3, name: "Mechanical Keyboard", price: "$150", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200" },
  { id: 4, name: "Designer Sunglasses", price: "$250", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200" },
  { id: 4, name: "Designer Sunglasses", price: "$250", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200" },
  { id: 5, name: "Leather Backpack", price: "$120", img: "https://images.unsplash.com/photo-1548036654-3d603baa0bd4?w=200" },
];

// Double the array to create the infinite seamless loop effect
const LOOP_DATA = [...PRODUCTS, ...PRODUCTS];

export default function ProductSlider() {
  return (
    <Box sx={{
      flex: 1,
      overflow: 'hidden',
      // py: 4,
      // bgcolor: 'background.default',
      position: 'relative',
      // Subtle fade on the edges to make it look premium
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        width: '100px',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      },
      '&::before': { left: 0, background: (theme) => `linear-gradient(to right, ${theme.palette.primary.main}, transparent)`},
      '&::after': { right: 0, background: (theme) => `linear-gradient(to left, ${theme.palette.primary.main}, transparent)`},
    }}>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-50%" }} // Move halfway (the length of one full set)
        transition={{
          duration: 20, // Adjust for speed (higher = slower)
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          display: 'flex',
          //   gap: '20px',
          width: 'fit-content', // Essential to keep items in a single row
        }}
      >
        {LOOP_DATA.map((item, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              // width: '100px',
              borderRadius: '12px',
              overflow: 'hidden',
              //   mr: 2,
              flexShrink: 0,
              bgcolor: 'transparent',
              '&:hover': { transform: 'translateY(-5px)', transition: '0.3s' }
            }}
          >
            <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
              {/* The Bullet Icon */}
              <Box sx={{ display: 'flex'}}> {/* Slight margin-top to align with the first line of text */}
                <FontAwesomeIcon
                  icon={faCircle}
                  style={{ fontSize: '8px', color: '#1976d2' }}
                />
              </Box>

              {/* The Text Content */}
              <Box sx={{ }}> {/* minWidth: 0 prevents 'noWrap' from breaking flexbox */}
                <Typography variant="subtitle2" noWrap>
                  {item.name}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </motion.div>
    </Box>
  );
}