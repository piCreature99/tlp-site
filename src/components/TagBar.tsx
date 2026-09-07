import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { darken } from '@mui/material/styles';
import { HorizontalScrollWrapper } from './HorizontalScrollWrapper';
import { useMetadata } from './MetadataProvider';
import { useLocalProducts } from '../context/LocalProductContext';

const MOCK_TAGS = [
    'Best Seller',
    'Top Rated',
    'Customer Favorite',
    'Limited Edition',
    'Low Stock',
    'Flash sale',
    '10% off',
    'Price Drop',
]

export default function TagBar() {
    const { tags } = useMetadata();
    const { selectedTags, selectedTagsHandler } = useLocalProducts();
    const selectedHighlights = [...selectedTags];
    return (
        <HorizontalScrollWrapper justify='left'>

            <Stack direction="row" spacing={0.5}
                sx={{
                    my: 1.5,
                    // py: .5,
                    // flexGrow: 1,
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
                {tags.map((tag, _) => {
                    return (
                        <Box key={tag.slug} component={ButtonBase} onClick={() => {
                            selectedTagsHandler(tag.slug);
                        }} 
                        sx={{ flexShrink: 0, borderRadius: 8, p: 1, 
                        backgroundColor: 'background.paper', border: '2px solid', 
                        borderColor: selectedHighlights.includes(tag.slug) ? 'primary.main' : (theme) => darken(theme.palette.background.paper, 0.1) }}>

                            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: '800', lineHeight: 1.2, fontSize: 11 }}>
                                {tag.name}
                            </Typography>
                        </Box>
                    );
                })}
            </Stack>
        </HorizontalScrollWrapper>
    );
}