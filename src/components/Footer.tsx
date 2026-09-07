import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import {
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    Link,
    Stack,
    TextField, // Importing Grid2 is the current standard for the 'item-less' grid
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid';

const FOOTER_DATA = [
    { title: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Sale'] },
    { title: 'Support', links: ['Help Center', 'Shipping', 'Returns'] },
    { title: 'Legal', links: ['Privacy', 'Terms'] },
];

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid', borderColor: 'divider' }}>
            <Container maxWidth="lg">
                {/* The new Grid doesn't need "container" or "item" props */}
                <Grid container spacing={4}>

                    {/* Brand Section */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: "900",
                            letterSpacing: 1,
                        }}>
                            MODERN STORE
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                            Elevating your lifestyle with curated collections and seamless experiences.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <TextField size="small" placeholder="Newsletter" fullWidth />
                            <Button variant="contained" color="primary">Join</Button>
                        </Stack>
                    </Grid>

                    {/* Links Sections */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Grid container spacing={2}>
                            {FOOTER_DATA.map((section) => (
                                <Grid size={{ xs: 6, sm: 4 }} key={section.title}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
                                        {section.title}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {section.links.map((link) => (
                                            <Link key={link} href="#" variant="body2" color="text.secondary" underline="hover">
                                                {link}
                                            </Link>
                                        ))}
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{
                    justifyContent: "space-between", alignItems: "center"
                }}>
                    <Typography variant="caption" color="text.secondary">
                        © {new Date().getFullYear()} Modern Store. Built with passion.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <IconButton size="small"><FacebookIcon fontSize="small" /></IconButton>
                        <IconButton size="small"><TwitterIcon fontSize="small" /></IconButton>
                        <IconButton size="small"><InstagramIcon fontSize="small" /></IconButton>
                    </Stack>
                </Stack>
                {/* Trust & Registration Badges */}
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: "center",
                        direction: "row",
                        mt: 2,
                        opacity: 0.8,
                        filter: 'grayscale(100%)',
                        '&:hover': { filter: 'none' }
                    }}
                >
                    {/* DMCA Badge */}
                    <Link href="https://www.dmca.com/..." target="_blank">
                        <Box
                            component="img"
                            src="https://images.dmca.com/Badges/dmca-badge-w100-5x1-08.png"
                            alt="DMCA.com Protection Status"
                            sx={{ width: 100, height: 'auto' }}
                        />
                    </Link>

                    {/* Ministry of Trade (Bo Cong Thuong) */}
                    <Link href="http://online.gov.vn/..." target="_blank">
                        <Box
                            component="img"
                            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Android_logo_2019_%28stacked%29.svg"
                            alt="Registered with Ministry of Industry and Trade"
                            sx={{ width: 120, height: 'auto' }}
                        />
                    </Link>
                </Stack>
            </Container>
        </Box>
    );
}