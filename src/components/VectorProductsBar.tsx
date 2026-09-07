import { Box, Button, useMediaQuery } from '@mui/material';
import { darken } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useState } from 'react';
import BrandBar from './BrandBar';

import { theme } from '../themes/theme';
import { HorizontalScrollWrapper } from './HorizontalScrollWrapper';
import ProductPagination from './PaginationBar';
import ProductDisplay from './ProductDisplay';
import TagBar from './TagBar';
import type { Category, Product } from './types/types';
import SideVector from './types/utils/vectors/navVec';
import { useLocalProducts } from '../context/LocalProductContext';

export default function VectorProductBar() {
    const { categories, products, setSelectedCategory, activePage, totalPages, setActivePage } = useLocalProducts();
    // console.log(products);
    const [activeIndex, setActiveIndex] = useState(0);
    // const [products, setProducts] = useState<Product[]>([]);
    // const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    // const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);
    // const [totalPages, setTotalPages] = useState<number>(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState(0);
    // const [pageData, setPageData] = useState([1, 0]); // [activeIndex, direction]
    // const [activePage, direction] = pageData;
    // const theme = useTheme(); // 1. Get the theme object

    // Returns true if the screen is 900px or wider
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    // Returns true if the screen is between 600px and 899px
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    // Returns true if the screen is below xs
    const isSmallest = useMediaQuery(theme.breakpoints.down('xs'));
    const productCount = isDesktop ? 12 : isTablet ? 9 : 6;

    // const limit = isDesktop ? 12 : 6;

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number): void => {
        updateSlider(value);
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateSlider = (newIndex: number, forcedDirection?: number) => {

        // If an animation is currently playing, exit early and do nothing
        // if (isAnimating) return;

        // Otherwise, start the animation
        // setIsAnimating(true);

        // 1. Calculate direction if not provided (for List clicks)
        const newDirection = forcedDirection !== undefined
            ? forcedDirection
            : (newIndex > activePage ? 1 : -1);

        // 2. Handle Looping (for Arrow clicks)
        const loopedPageIndex = ((newIndex - 1 + totalPages) % totalPages) + 1;
        // console.log(newIndex);
        
        // 3. Update the single source of truth
        // setPageData([loopedPageIndex, newDirection]);
        setActivePage(loopedPageIndex);
        setDirection(newDirection);
    };
    // console.log(direction);
    // console.log(activePage);

    // 1. Fetch categories on mount
    // useEffect(() => {
    //     const getCategories = async () => {
    //         try {
    //             const response = await fetch('/api/categories'); // The browser glue this with your site address together
    //             const catList: Category[] = await response.json();
    //             // Set your categories state for the UI bar
    //             setCategories(catList);

    //             // Set the default! This triggers the second useEffect
    //             if (catList.length > 0 && !selectedCategory) {
    //                 setSelectedCategory(catList[0]);
    //             }
    //         } catch (err) {
    //             console.error("Failed to load categories", err);
    //         }
    //     };
    //     getCategories();
    // }, []); // Runs once on load

    // useEffect(() => {
    //     // Prevent fetching if selectedCategory is still empty
    //     if (!selectedCategory) return;

    //     const fetchProducts = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await fetch(`/api/products?category=${encodeURIComponent(selectedCategory)}`);
    //             const data: Product[] = await response.json();
    //             setProducts(data);
    //         } catch (err) {
    //             console.error("Fetch products error:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     fetchProducts();
    // }, [selectedCategory]);

    // useEffect(() => {

    //     if (!selectedCategory) return;

    //     const loadData = async () => {
    //         // We send the current limit (6 or 12) to the backend
    //         const res = await fetch(`/api/products?category=${encodeURIComponent(selectedCategory.slug)}&limit=${productCount}&page=${activePage}`);
    //         // encdoeURIComponent to format params with an &
    //         const data: ProductAndPage = await res.json();

    //         setProducts(data.products);
    //         setTotalPages(data.totalPages);
    //     };
    //     loadData();
    // }, [selectedCategory, activePage, productCount]);

    return (
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', py: 1, borderRadius: 1, overflow: 'hidden', bgcolor: 'background.paper', filter: 'drop-shadow(0px 4px 5px rgba(0,0,0,0.2))', }}>
            <HorizontalScrollWrapper >

                <Box sx={{ display: 'flex', justifyContent: 'flex-start', bgcolor: 'background.paper', }}>
                    <Box sx={{ display: 'flex', flex: 1, mx: 1, gap: 4, borderRadius: 1, overflow: 'hidden', backgroundColor: (theme) => darken(theme.palette.background.paper, 0.1) }}>
                        {categories.map((category, index) => {
                            const isActive = activeIndex === index;

                            return (
                                <Box
                                    key={category.slug}
                                    component={motion.div}
                                    sx={{
                                        height: 50,
                                        display: 'flex',
                                        position: 'relative',
                                        backgroundColor: isActive ? 'background.paper' : (theme) => darken(theme.palette.background.paper, 0.1),
                                    }}
                                >
                                    <Button
                                        onClick={() => { setActiveIndex(index); setSelectedCategory(category.slug) }}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: isActive ? 700 : 400,
                                            color: isActive ? 'primary.main' : 'text.secondary',
                                            px: 3,
                                            '&:hover': { bgcolor: 'transparent' }
                                        }}
                                    >
                                        {category.name}
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
            </HorizontalScrollWrapper>
            {/* <BannerSlider activeIndex={activeIndex} /> */}
            <TagBar />
            <BrandBar />
            <ProductDisplay index={activeIndex} products={products} productCount={productCount} activePageIndex={activePage} dir={direction} isLoading={isLoading} />
            <ProductPagination
                page={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </Box>
    );
}