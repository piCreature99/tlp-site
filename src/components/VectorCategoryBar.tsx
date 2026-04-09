import { useState } from 'react';
import { Box, Button, } from '@mui/material';
import { darken, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import BannerSlider from './BannerSlider';
import type { BannerItem } from './types/types';

const BANNER_DATA: BannerItem[] = [
    { id: 0, category: 'Electronics', image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000", color: "#1976d2" },
    { id: 1, category: 'Fashion', image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000", color: "#ed6c02" },
    { id: 2, category: 'Home', image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000", color: "#2e7d32" },
    { id: 3, category: 'Sports', image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000", color: "#000" },
    { id: 4, category: 'Beauty', image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000", color: "#ff4081" },
    { id: 5, category: 'Automotive', image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000", color: "#7b1fa2" },
];

// This is your "Vector Shape" - customize the SVG path for your specific look
const SideVector = ({ side, bgColor }: { side: 'left' | 'right', bgColor: string }) => (
    <motion.svg
        layoutId={`vector-${side}`}
        transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
        }}
        style={{
            position: 'absolute',
            [side]: '-30px',
            top: '50%',
            y: '-50%',
            zIndex: 1,
            pointerEvents: 'none',
            overflow: 'visible'
        }}
        width="30"
        height="50"
        viewBox="0 0 30 50"
    >
        <path
            d={side === 'left'
                // LEFT SIDE: Start bottom-right (30,50), fast rise to top-left (0,0)
                // C 30 25 (shoots up), 15 0 (pulls left), 0 0 (ends flat at top)
                ? "M30 50 C 30 25, 15 0, 0 0 L 30 0 Z"

                // RIGHT SIDE: Start bottom-left (0,50), fast rise to top-right (30,0)
                // C 0 25 (shoots up), 15 0 (pulls right), 30 0 (ends flat at top)
                : "M0 50 C 0 25, 15 0, 30 0 L 0 0 Z"
            }
            fill={bgColor}
        />
    </motion.svg>
);

export default function VectorCategoryBar() {
    const [pageData, setPageData] = useState([0, 0]); // [activeIndex, direction]
    const [activeIndex, direction] = pageData;
    const [isAnimating, setIsAnimating] = useState(false);
    const theme = useTheme(); // 1. Get the theme object

    // The unified UPdate function
    const updateSlider = (newIndex: number, forcedDirection?: number) => {

        // If an animation is currently playing, exit early and do nothing
        if (isAnimating) return;

        // Otherwise, start the animation
        setIsAnimating(true);

        // 1. Calculate direction if not provided (for List clicks)
        const newDirection = forcedDirection !== undefined
            ? forcedDirection
            : (newIndex > activeIndex ? 1 : -1);

        // 2. Handle Looping (for Arrow clicks)
        const loopedIndex = (newIndex + BANNER_DATA.length) % BANNER_DATA.length;

        // 3. Update the single source of truth
        setPageData([loopedIndex, newDirection]);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, py: 1, borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper', mx: 2, filter: 'drop-shadow(0px 4px 5px rgba(0,0,0,0.2))', }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: 'background.paper', }}>
                <Box sx={{ display: 'flex', gap: 4 }}>
                    {BANNER_DATA.map((category, index) => {
                        const isActive = activeIndex === index;

                        return (
                            <Box
                                key={category.category}
                                component={motion.div}
                                sx={{
                                    height: 50,
                                    display: 'flex',
                                    position: 'relative',
                                    backgroundColor: isActive ? (theme) => darken(theme.palette.background.paper, 0.1) : 'background.paper',
                                }}
                            >
                                <Button
                                    onClick={() => updateSlider(index)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: isActive ? 700 : 400,
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        px: 3,
                                        '&:hover': { bgcolor: 'transparent' }
                                    }}
                                >
                                    {category.category}
                                </Button>

                                {/* Only the active button renders the vectors */}
                                {isActive && (
                                    <>
                                        <SideVector side="left" bgColor={darken(theme.palette.background.paper, 0.1)} />
                                        <SideVector side="right" bgColor={darken(theme.palette.background.paper, 0.1)} />
                                        {/* Optional: Background highlight that also slides */}
                                        <motion.div
                                            layoutId="activeBackground"
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                                                borderRadius: '8px',
                                                zIndex: -2
                                            }}
                                        />
                                    </>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <BannerSlider activeIndex={activeIndex} dir={direction} items={BANNER_DATA} onDirectionChange={updateSlider} isAnimating={setIsAnimating} />
        </Box>
    );
}