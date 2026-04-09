import { Box, Button } from '@mui/material';
import { darken } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useState } from 'react';
import BrandBar from './BrandBar';
import ProductDisplay from './ProductDisplay';
import TagBar from './TagBar';

const categories = ['Electronics', 'Fashion', 'Home', 'Sports',
    'Beauty',
    'Automotive',];

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
                // ? "M30 50 C 30 25, 15 0, 0 0 L 30 0 Z"
                ? "M30 0 C 30 25, 15 50, 0 50 L 30 50 Z" // flip y
                // M means move to a starting point
                // M30 50 means x = 30, y = 50,
                // C = cubic bezier curve, create smooth curve using 2 control points
                // Requires 3 pairs of numbers: ControlPoint1, ControlPoint2, and EndPoint
                // L Line to, Draws a perfectly straight line from the current position to the new coordinates
                // L 30 0 means: "Draw a straight line back to the very first point M to seal the shape so it can be filled"

                // RIGHT SIDE: Start bottom-left (0,50), fast rise to top-right (30,0)
                // C 0 25 (shoots up), 15 0 (pulls right), 30 0 (ends flat at top)
                // : "M0 50 C 0 25, 15 0, 30 0 L 0 0 Z"
                : "M0 0 C 0 25, 15 50, 30 50 L 0 50 Z" // flip y
            }
            fill={bgColor}
        />
    </motion.svg>
);

export default function VectorProductBar() {
    const [activeIndex, setActiveIndex] = useState(0);
    // const theme = useTheme(); // 1. Get the theme object

    return (
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', py: 1, borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper', filter: 'drop-shadow(0px 4px 5px rgba(0,0,0,0.2))', }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', bgcolor: 'background.paper', }}>
                <Box sx={{ display: 'flex', flex: 1, mx: 1, gap: 4, borderRadius: 1, overflow: 'hidden', backgroundColor: (theme) => darken(theme.palette.background.paper, 0.1) }}>
                    {categories.map((category, index) => {
                        const isActive = activeIndex === index;

                        return (
                            <Box
                                key={category}
                                component={motion.div}
                                sx={{
                                    height: 50,
                                    display: 'flex',
                                    position: 'relative',
                                    backgroundColor: isActive ? 'background.paper' : (theme) => darken(theme.palette.background.paper, 0.1),
                                }}
                            >
                                <Button
                                    onClick={() => setActiveIndex(index)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: isActive ? 700 : 400,
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        px: 3,
                                        '&:hover': { bgcolor: 'transparent' }
                                    }}
                                >
                                    {category}
                                </Button>

                                {/* Only the active button renders the vectors */}
                                {isActive && (
                                    <>
                                        <SideVector side="left" bgColor={'white'} />
                                        <SideVector side="right" bgColor={'white'} />
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
            {/* <BannerSlider activeIndex={activeIndex} /> */}
            <TagBar />
            <BrandBar />
            <ProductDisplay index={activeIndex}/>
        </Box>
    );
}