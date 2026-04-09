import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // The matching right arrow
import { Box, IconButton } from '@mui/material';
import { darken } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { BannerItem } from './types/types';

// 1. Updated Data Structure with Image URLs

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};
// animation explanation: first it detect direction is added 1, the motion.div start at x + 100% then slide into center at x = 0, then the second soon to be
// dismounted motion.div slides from center to x -100% (thanks to animate presence keeping the second copmonent for a bit)

export default function BannerSlider({ activeIndex, dir, items, onDirectionChange, isAnimating }: { activeIndex: number, dir: number, items: BannerItem[], onDirectionChange: (direction: number, forcedDirection?: number) => void, isAnimating: (state: boolean) => void }) {
  const [[page, direction], setPage] = useState([activeIndex, 0]); // This won't change the next time parent pass in different activeindex

  if (activeIndex !== page) {
    setPage([activeIndex, dir]);
  }

  const currentBanner = items[page];

  return (
    <Box sx={{
      height: '400px', // Increased height for better image display
      position: 'relative',
      overflow: 'hidden',
      m: 2,
      borderRadius: '16px',
      bgcolor: '#000', // Black fallback looks better for images
    }}>
      {/* Left Arrow */}
      <IconButton
        onClick={() => onDirectionChange(activeIndex - 1, -1)}
        sx={{
          borderRadius: 1,
          height: 100,
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2, // Must be higher than the motion.div
          bgcolor: (theme) => darken(theme.palette.background.paper, 0.8),
          opacity: .5,
          '&:hover': {
            bgcolor: (theme) => darken(theme.palette.background.paper, 0.9),
            opacity: .8,
          },
        }}
      >
        <ArrowBackIosNewIcon sx={{ color: '#fff' }} />
      </IconButton>

      {/* Right Arrow */}
      <IconButton
        onClick={() => onDirectionChange(activeIndex + 1, 1)}
        sx={{
          borderRadius: 1,
          height: 100,
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          opacity: .5,
          bgcolor: (theme) => darken(theme.palette.background.paper, 0.8),
          '&:hover': {

            bgcolor: (theme) => darken(theme.palette.background.paper, 0.9),
            opacity: .8,
          },
        }}
      >
        <ArrowForwardIosIcon sx={{ color: '#fff' }} />
      </IconButton>
      {/* AnimatePresence keeps the unmounted motion.div around for a bit for the exit animation to finish */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page} // tell react this is a brand new component everytime the page number changes
          custom={direction}
          variants={variants} // enter, center, exit defined above 1
          initial="enter" // Define the visual state of the element before it mounts. It's where the element starts 
          animate="center" // defines the state you want the element to reach. Framer motion will automatically calculate the "tween" between 2
          // your initial state and this animate state
          exit="exit"
          // for exit to work, motion.div must be wrapped within an animate presence component. Without that wrapper, react will simply delete the element 3
          // instantly before the exit animation has a chance to play
          transition={{
            x: { type: "spring", stiffness: 200, damping: 25 }, // Slightly softer spring for images
            opacity: { duration: 0.3 }
          }}
          onAnimationComplete={() => isAnimating(false)}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Using a native img tag for performance with object-fit */}
          <img
            src={currentBanner.image}
            alt={`Banner ${page}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // This ensures the image fills the area without stretching
              display: 'block'
            }}
          />

          {/* Optional Overlay: Makes the slide feel more premium */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))'
          }} />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}