import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, Fab, Stack } from "@mui/material";
import CategoryBar from "./CategoryBar";
import Footer from "./Footer";
import { useNavigation } from "./NavigationContext";
import ProductPage from "./ProductPage";
import ScrollTop from "./ScrollTop";
import SideBanners from "./SideBanners";
import VectorCategoryBar from "./VectorCategoryBar";
import VectorProductBar from "./VectorProductsBar";

export default function Home() {
    const { view, 
        // selectedProduct,
         navigateToHome } = useNavigation();

    return (
        <>
            {view === 'home' ? (
                <Box>

                    <CategoryBar />
                    <VectorCategoryBar />
                    <Stack
                        direction={'row'}
                        sx={{ p: 2 }}
                        spacing={2}
                    >
                        <VectorProductBar />
                        <SideBanners />
                    </Stack>
                </Box>
            ) : (
                <Stack sx={{ px: 2, pt: 3 }}>
                    {/* Clean Return Action Trigger */}
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={navigateToHome}
                        sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 700 }}
                        color="inherit"
                    >
                        Back to Catalog
                    </Button>

                    <ProductPage />
                </Stack>
            )}
            <Footer />
            <ScrollTop>
                <Fab
                    size="medium"
                    color="primary"
                    aria-label="scroll back to top"
                    sx={{
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
                        '&:hover': {
                            transform: 'scale(1.1)', // Extra "pop" for the UI
                        }
                    }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </>
    );

}