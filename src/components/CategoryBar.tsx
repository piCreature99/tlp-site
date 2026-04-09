import { Box, Button, Container, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Automotive',
    'Books',
    'Toys',
    'Health'
];

export default function CategoryBar() {
    const theme = useTheme();
    return (
        <>
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: 1,
                    borderColor: 'divider',
                    // boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.05)'
                    filter: 'drop-shadow(0px 4px 5px rgba(0,0,0,0.2))',
                }}
            >
                <Container maxWidth="xl"
                    sx={{
                        overflow: 'visible',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflowX: 'visible', // Allows scrolling on mobile
                            whiteSpace: 'nowrap',
                            py: 0.5,
                            '&::-webkit-scrollbar': { display: 'none' }, // Hides scrollbar for clean look
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                        }}
                    >
                        {categories.map((category) => (
                            <motion.div
                                key={category}
                                layout
                                whileHover={{
                                    // 2. Increase horizontal space to "push" neighbors
                                    marginLeft: '20px',
                                    marginRight: '20px',
                                    scale: 1.5,
                                    top: "25%",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 40,
                                }}
                                style={{
                                    padding: 2,
                                    backgroundColor: theme.palette.background.paper ,
                                    position: 'relative',
                                    borderRadius: 5,
                                    display: 'flex',
                                }}
                            >
                                <Button
                                    key={category}
                                    color="inherit" // use whatever color the parent component is using
                                    sx={{
                                        borderRadius: 0.5,
                                        py: 0,
                                        px: 0.5,
                                        my: 0,
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        fontSize: '0.675rem',
                                        // mx: 1,
                                        minWidth: 'fit-content',
                                        color: 'text.secondary',
                                        '&:hover': {
                                            color: 'background.paper',
                                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8),
                                        },
                                    }}
                                >
                                    {category}
                                </Button>
                            </motion.div>
                        ))}
                    </Box>
                </Container>
            </Box>

        </>
    );
}