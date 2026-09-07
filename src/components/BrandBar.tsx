import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { darken } from '@mui/material/styles';
import { HorizontalScrollWrapper } from './HorizontalScrollWrapper';
import { useMetadata } from './MetadataProvider';
import { useLocalProducts } from '../context/LocalProductContext';

const MOCK_BRANDS = [
    'SAMSUNG',
    'SONY',
    'APPLE',
    'ASUS',
    'DELL',
    'HP',
    'LENOVO',
    'BOSE',
    'SENNHEISER',
    'LOGITECH',
]

export default function BrandBar() {
    const { brands } = useMetadata();
    const { selectedBrands, selectedBrandsHandler } = useLocalProducts();
    const selectedHighlights = [...selectedBrands];
    return (
        <HorizontalScrollWrapper justify='left'>


            <Stack direction="row" spacing={0.5}
                sx={{
                    // py: .5,
                    // mx: 1.5,
                    // // flexGrow: 1,
                    // overflowX: 'auto',
                    // '&::-webkit-scrollbar': { width: '8px', height: '6px' },
                    // '&::-webkit-scrollbar-thumb': {

                    //     borderRadius: '4px',
                    //     backgroundColor: 'rgba(0,0,0,0.2)', // Light gray

                    //     '&:hover': {
                    //         backgroundColor: 'rgba(0,0,0,0.3)', // Darker on hover
                    //     },
                    // },
                    // '&::-webkit-scrollbar-track': {
                    //     backgroundColor: 'transparent',
                    // },
                }}>
                {/* Price Tag */}
                {/* Typography is useful for scalable design, in which you only control the theme for font style */}
                {brands.map((brand, _) => {
                    return (
                        <Box key={brand.slug} component={ButtonBase} onClick={() => {selectedBrandsHandler(brand.slug)}} sx={{ borderRadius: .5, p: 1, backgroundColor: 'background.paper', border: '2px solid', 
                        borderColor: selectedHighlights.includes(brand.slug) ? 'primary.main' : (theme) => darken(theme.palette.background.paper, 0.1) }}>

                            <Typography variant="h6" color="primary.main" sx={{
                                lineHeight: 1.2,
                                fontWeight: "800",
                                fontSize: 25,
                            }}>
                                {brand.name}
                            </Typography>
                        </Box>
                    );
                })}
            </Stack>
        </HorizontalScrollWrapper>
    );
}