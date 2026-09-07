import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  selectedCat?: string | number;
  step?: number;
  justify?: 'left' | 'right';
}

export const HorizontalScrollWrapper = ({ children, step = 250, selectedCat, justify }: Props) => {
  const [offset, setOffset] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false); // The "Breakpoint" state

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const updateBounds = () => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;

      if (contentWidth <= containerWidth) {
        setIsOverflowing(false);
        setOffset(0); // Reset position if it fits
        setMaxScroll(0);
      } else {
        setIsOverflowing(true);
        setMaxScroll(containerWidth - contentWidth);
      }
    }
  };

  // THE SYNC LOGIC: Follow the selected item
  useEffect(() => {
    if (!selectedCat || !containerRef.current || !contentRef.current) return;

    // Find the active element within the children
    const activeElement = contentRef.current.querySelector(`[data-id="${selectedCat}"]`) as HTMLElement;
    
    if (activeElement) {
      const container = containerRef.current;
      const { offsetLeft, offsetWidth } = activeElement;
      // offsetLeft: Tells you how many pixels fro the very start of the long, hidden flex-stirp the category chip begins
      // offsetWidth: tells you the total width of the chip, including its padding and border (but not margins).
      
      // Calculate positions relative to the current offset
      const elementLeft = offsetLeft + offset; // left side of the element
      const elementRight = elementLeft + offsetWidth; // right side of the element
      const containerWidth = container.offsetWidth; // physical width of what you see of the container

      // ex: full container is -500 to the left
      // elementLeft current position in the container is 250 (the element is partially hidden)
      // compare it to the current offset of the full container, we get a -250 offset from its physical views left edge
      // elementRight is elementLeft + its width (ex: 300) = 550, since it's not greater than the container width (not offset out of bound on the right),
      // the first if condition is skipped
      // the second if
      // if the element is hidden on the left (-250 < 0 ?) yes. Assign extrascroll with the elementLeft value then add it with the previous value of offset,
      // if the value is lesser than the default full container position, return 0 instead. 

      // 1. If element is hidden on the RIGHT
      if (elementRight > containerWidth) {
        const extraScroll = elementRight - containerWidth + 40; // +40 for some padding
        setOffset((prev) => Math.max(prev - extraScroll, maxScroll));
      }
      
      // 2. If element is hidden on the LEFT
      else if (elementLeft < 0) {
        const extraScroll = Math.abs(elementLeft) + 40;
        setOffset((prev) => Math.min(prev + extraScroll, 0)); // from example above, prev right now is -500, it should scroll to position -250 to reveal the hidden part
      }
    }
  }, [selectedCat, maxScroll]); // Re-run when selection changes

  useEffect(() => {
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [children]);

  const handleScroll = (direction: 'left' | 'right') => {
    setOffset((prev) => {
      let newOffset = direction === 'left' ? prev + step : prev - step; // accumulating the steps. If it slide to the left (-step), the second if handles the right bound, 
      // and if it slides to the right (+step), the first if handles the left bound
      if (newOffset > 0) return 0;
      if (newOffset < maxScroll) return maxScroll;
      return newOffset;
    });
  };

  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', mx: 2, }}>

      {/* 1. Conditional Arrows: Only render if isOverflowing is true */}
      <AnimatePresence>
        {isOverflowing && offset < 0 && (
          <Box sx={{
            position: 'absolute', left: 0, zIndex: 10, display: 'flex', alignItems: 'center', height: '100%',
            background: 'linear-gradient(90deg, white 60%, transparent)'
          }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
              display: 'flex',
              aspectRatio: '1/2',
              // justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconButton onClick={() => handleScroll('left')} size="small" sx={{
                bgcolor: 'background.paper',
                height: '70%',
                width: '70%',
                opacity: '.6',
                // boxShadow: 2,
                // aspectRatio: '1/2',
                borderRadius: 0,
                borderTopRightRadius: '100px',
                borderBottomRightRadius: '100px',
              }}>
                <ChevronLeft />
              </IconButton>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      <Box ref={containerRef} sx={{
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        // 2. Alignment Logic: Center if it fits, Start if it overflows
        justifyContent: isOverflowing || justify === 'left' ? 'flex-start' : justify === 'right' ? 'flex-end' : 'center',
      }}>
        <motion.div
          ref={contentRef}
          animate={{ x: offset }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          style={{ display: 'flex', width: 'max-content' }}
        >
          {children}
        </motion.div>
      </Box>

      <AnimatePresence>
        {isOverflowing && offset > maxScroll && (
          <Box sx={{
            position: 'absolute', right: 0, zIndex: 10, display: 'flex', alignItems: 'center', height: '100%',
            background: 'linear-gradient(270deg, white 60%, transparent)'
          }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
              display: 'flex',
              aspectRatio: '1/2',
              // justifyContent: 'center',
              alignItems: 'center', 
              flexDirection: 'row-reverse',
            }}>
              <IconButton onClick={() => handleScroll('right')} size="small" sx={{ 
                bgcolor: 'background.paper', 
                // boxShadow: 2,
                height: '70%',
                width: '70%',
                opacity: '.6',
                // boxShadow: 2,
                // aspectRatio: '1/2',
                borderRadius: 0,
                borderTopLeftRadius: '100px',
                borderBottomLeftRadius: '100px',
                }}>
                <ChevronRight />
              </IconButton>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};