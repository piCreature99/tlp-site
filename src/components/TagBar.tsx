import { Box, Stack, Typography } from '@mui/material';
import { darken } from '@mui/material/styles';

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

    return (
        <Stack direction="row" spacing={0.5}
            sx={{
                m: 1.5,
                flexGrow: 1,
                overflowX: 'auto',
                '&::-webkit-scrollbar': { width: '8px', height: '6px' },
                '&::-webkit-scrollbar-thumb': {

                    borderRadius: '4px',
                    backgroundColor: 'rgba(0,0,0,0.2)', // Light gray

                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.3)', // Darker on hover
                    },
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                },
            }}>
            {/* Price Tag */}
            {/* Typography is useful for scalable design, in which you only control the theme for font style */}
            {MOCK_TAGS.map((tag, _) => {
                return (
                    <Box sx={{flexShrink: 0, borderRadius: .5, p: 1, backgroundColor: (theme) => darken(theme.palette.background.paper, 0.1) }}>

                        <Typography variant="h6" color="text.secondary" sx={{fontWeight: '800', lineHeight: 1.2, fontSize: 11 }}>
                            {tag}
                        </Typography>
                    </Box>
                );
            })}
        </Stack>
    );
}