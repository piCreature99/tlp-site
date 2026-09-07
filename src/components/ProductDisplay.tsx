import { SearchOff } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { JoinedProduct } from '../api/indexedDB';
import ProductSlot from './ProductSlot';

// const shuffleArray = (array: any) => {
//     const shuffled = [...array];

//     for (let i = shuffled.length - 1; i > 0; i--) {
//         // Pick a random index from 0 to i
//         const j = Math.floor(Math.random() * (i + 1));

//         // Swap elements [i] and [j]
//         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }

//     return shuffled;
// };

// const MOCK_PRODUCTS: MockProducts[] = [
//     { id: 1, name: "Premium Wireless Headphones", price: "$299", rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", discount: "20% OFF" },
//     { id: 2, name: "Minimalist Smart Watch V2", price: "$150", rating: 4.5, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", discount: "Free Shipping" },
//     { id: 3, name: "Mechanical RGB Keyboard", price: "$89", rating: 4.2, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400", discount: "New Arrival" },
//     { id: 4, name: "Ultra-Wide Gaming Monitor", price: "$450", rating: 4.9, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400", discount: "Bundle Deal" },
//     { id: 5, name: "Ergonomic Office Chair", price: "$210", rating: 4.0, image: "https://images.unsplash.com/photo-1505843490701-5be5d2b01cc6?w=400", discount: "Limited Stock" },
//     { id: 6, name: "Leather Travel Backpack", price: "$120", rating: 4.6, image: "https://images.unsplash.com/photo-1548036654-3d603baa0bd4?w=400", discount: "Flash Sale" },
//     { id: 7, name: "Noise Cancelling Earbuds", price: "$199", rating: 4.7, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", discount: "Buy 1 Get 1" },
//     { id: 8, name: "Smart Home Security Camera 4K", price: "$75", rating: 4.3, image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400", discount: "Price Drop" },
// ];


export default function ProductDisplay({ 
    // index, 
    products, productCount, activePageIndex, dir, 
    // isLoading = true 
}: { index: number, products: JoinedProduct[], productCount: number, activePageIndex: number, dir: number, isLoading?: boolean }) {
    const [[page, direction], setPage] = useState([activePageIndex, 0]);
    const [contentHeight, setContentHeight] = useState<number | 'auto'>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isEmpty = products.length === 0;
    // console.log(products);

    useEffect(() => {
        // 1. Target the first child of the container (your absolute motion.div)
        const activeChild = containerRef.current?.querySelector(`[data-index="${page}"]`);
        if (!activeChild) return;

        // 2. Create an observer to measure the height
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // Update the state with the new height
                setContentHeight(entry.contentRect.height);
            }
        });

        observer.observe(activeChild);
        return () => observer.disconnect();
    }, [page]);

    if (activePageIndex !== page) {
        setPage([activePageIndex, dir]);
    }

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

    return (
        <Container maxWidth={false} disableGutters sx={{ py: 4, px: 1, }}>
            {/* 1. Ensure 'container' is present */}
            <Box
                // ref={containerRef}
                ref={containerRef}
                sx={{
                    height: contentHeight,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >

                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page} // Using page as key triggers animation on every page change
                        data-index={page}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 200, damping: 25 }, // Slightly softer spring for images
                            opacity: { duration: 0.3 }
                        }}
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            // marginRight: '8px',
                            left: '0px',
                            right: '0px',
                            // right: '8px',
                            // width: '100%',
                            // height: '100%',
                            minHeight: isEmpty ? '450px' : 'auto',
                        }}
                    >
                        {isEmpty ? (
                            /* PREMIUM EMPTY STATE VIEW */
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    p: 6,
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    borderRadius: '16px',
                                    bgcolor: 'background.paper',
                                    flex: 1,
                                }}
                            >
                                {/* Using your custom primary theme color for the alert icon */}
                                <SearchOff sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.8 }} />

                                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                                    No Products Found
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary', maxW: '320px', mb: 3, lineHeight: 1.6 }}>
                                    We couldn't find anything matching your exact filter selections. Try adjusting your tags or categories!
                                </Typography>
                                {/* 
                                {clearFilters && (
                                    <Button
                                        variant="outlined"
                                        onClick={clearFilters}
                                        sx={{
                                            fontWeight: 700,
                                            borderColor: 'text.primary',
                                            color: 'text.primary',
                                            '&:hover': {
                                                bgcolor: 'background.default',
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                            },
                                        }}
                                    >
                                        Reset All Filters
                                    </Button>
                                )} */}
                            </Box>
                        ) : (
                            <Box

                                sx={{

                                    display: 'grid',

                                    // 4 columns on desktop

                                    gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(4, 1fr)' },


                                    // 👇 THE MAGIC TRICK: Forces a baseline of 3 rows minimum, matching card heights

                                    gridTemplateRows: 'repeat(3, minmax(max-content, 1fr))',
                                    // minmax(min, max): expand as much as the max allow, and never shrink past min.
                                    // max-content means the browser calculate height by adding up the elements inside the card 
                                    // 1fr: "If there is extra vertical space left over on the screen, expand this row track to fill that space alongside the other rows."
                                    gap: 2,

                                    alignItems: 'stretch',

                                }}

                            >

                                {/* {products.length > 0 ? products.map((product: Product) => (
                    <Grid key={product.id} size={{ xs: 6, md: 3 }}>
                        <ProductCard product={product} />
                    </Grid>
                )) : (
                    //Show skeleton cards while loading
                    [...Array(12)].map((_, i) => {

                        return (
                            <Grid key={i} size={{ xs: 6, md: 3 }} sx={{
                                borderRadius: 1, overflow: 'hidden',
                            }}>
                                <Skeleton animation="wave" variant="rectangular" height={300} />
                            </Grid>

                        )
                    })
                )} */}
                                {[...Array(productCount)].map((_, i) => {
                                    const uniqueKey = `product-page-${page}-slot-${i}`;
                                    return (
                                        <ProductSlot key={uniqueKey} loading={false} product={products[i]} />
                                    )
                                })}
                            </Box>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Container >
    );
}