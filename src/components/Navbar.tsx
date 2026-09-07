import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    CircularProgress,
    ClickAwayListener,
    IconButton,
    InputBase,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Slide,
    Stack,
    Toolbar,
    Typography,
    useScrollTrigger,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import ProductSlider from './ProductSlider';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { singleHyphenFormat } from '../api/helper';
import { useLocalProducts } from '../context/LocalProductContext';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

// 1. Enhanced Search Bar (Longer and centered-ish)
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    // This makes it "longer" - it will take up 40% of the available space on large screens
    // flexGrow: 0.4,
    flex: 1,
    [theme.breakpoints.down('sm')]: {
        flex: 1,
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2), // 1 unit of spacing = 8px
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%', // Ensure it fills the Search container
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));

function HideOnScroll(props: { children: React.ReactElement, cart: number }) {
    const { children, cart } = props;

    // 1. Get the standard scroll trigger (true = scrolling down/hide)
    const scrollTrigger = useScrollTrigger();

    // 2. Create a local state to "force" the navbar to show
    const [forceShow, setForceShow] = useState(false);
    const [nearTop, setNearTop] = useState(false);

    useEffect(() => {
        if (cart) {
            setForceShow(true);

            // 3. Hide it again after a delay so scroll logic can take over
            const timer = setTimeout(() => {
                setForceShow(false);
            }, 2000); // Keep navbar visible for 2 seconds

            return () => clearTimeout(timer); // run immediately when dependency changes
        }
    }, [cart]); // Only trigger when the number of items changes

    // Effect 2: Handle the Mouse Proximity
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // If mouse is within 50px of the top, show the navbar
            if (e.clientY < 50) {
                setNearTop(true);
            } else {
                setNearTop(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 4. Logic: Navbar is "in" (visible) if we are NOT scrolling OR we are forcing it
    const isVisible = nearTop || forceShow || !scrollTrigger;

    return (
        <Slide appear={false} direction="down" in={isVisible}>
            {children}
        </Slide>
    );
}

export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, isAuthenticated, loading, logout } = useAuth();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { products } = useLocalProducts();

    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Example filtering logic (case-insensitive substring match)
    // Replace this with your data source variable
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // console.log(filteredProducts);

    // Determine if we should show the "No results" dropdown
    // Determine if we should show the results layout
    const hasQuery = searchQuery.trim().length > 0;
    const showResults = isOpen && hasQuery && filteredProducts.length > 0;
    const showNoResults = isOpen && hasQuery && filteredProducts.length === 0;
    // const showNoResults = searchQuery.trim().length > 0 && filteredProducts.length === 0;
    // useScrollTrigger returns 'true' when scrolling down

    const { 
        // cart,
         cartCount } = useCart();

    useEffect(() => {

    })

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // const isWorkArea = location.pathname === "/" || location.pathname.startsWith("/products");


    return (
        <Box sx={{}}>
            <HideOnScroll cart={cartCount}>

                <AppBar position="fixed" sx={{ backgroundColor: 'primary.main' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>

                        {/* STEP 1: COMPANY LOGO (FIRST) */}
                        <Typography
                            variant="h6"
                            component={Link}
                            to="/"
                            sx={{
                                fontWeight: 700,
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            TLP HRM
                        </Typography>

                        {/* STEP 2: SEARCH BAR (SECOND & LONGER) */}
                        {true ? (

                            <>
                                {/* <Search sx={{}}>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search products, services..."
                                        inputProps={{ 'aria-label': 'search' }}
                                    />
                                </Search> */}

                                <Box sx={{ position: 'relative', width: 'clamp(100px, 50vw, 500px)' }}>
                                    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                                        <div>
                                            <Search sx={{}}>
                                                <SearchIconWrapper>
                                                    <SearchIcon />
                                                </SearchIconWrapper>
                                                <StyledInputBase
                                                    placeholder="Search products, services..."
                                                    inputProps={{ 'aria-label': 'search' }}
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                        setIsOpen(true);
                                                    }}
                                                    onFocus={() => setIsOpen(true)}
                                                />
                                            </Search>

                                            {/* 🎯 FLOATING DROPDOWN PANEL */}
                                            {/* 🪟 DROPDOWN CONTAINER ELEMENT */}
                                            {isOpen && hasQuery && (
                                                <Paper
                                                    elevation={3}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '110%',
                                                        left: 16,
                                                        right: 16,
                                                        zIndex: 10,
                                                        maxHeight: '350px', // Prevents the dropdown from taking over the screen
                                                        // overflow: 'hidden',
                                                        overflowY: 'auto',   // Enables smooth scrolling for long result lists
                                                        backgroundColor: 'background.paper',
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: 'divider',

                                                        // 🚀 THE FIX: Force the scrollbar parts to respect the container's roundness
                                                        '&::-webkit-scrollbar': {
                                                            width: '8px', // Slightly thinner scrollbar looks more modern
                                                        },
                                                        '&::-webkit-scrollbar-track': {
                                                            backgroundColor: 'transparent',
                                                            borderRadius: '8px', // 🎯 Rounds the track background so it doesn't poke out
                                                        },
                                                        '&::-webkit-scrollbar-thumb': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.15)', // Subtle gray thumb
                                                            borderRadius: '8px', // 🎯 Rounds the actual dragging handle
                                                            border: '2px solid transparent', // Gives it some internal breathing room
                                                            backgroundClip: 'padding-box',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darkens on hover
                                                            },
                                                        },

                                                    }}
                                                >
                                                    {/* ❌ STATE A: NO RESULTS */}
                                                    {showNoResults && (
                                                        <Box sx={{ padding: 2, textAlign: 'center' }}>
                                                            <Typography variant="body1" color="text.secondary">
                                                                No results found
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {/* STATE B: MATCHING RESULTS FOUND */}
                                                    {showResults && (
                                                        <List disablePadding>
                                                            {filteredProducts.map((product) => (
                                                                <ListItemButton
                                                                    key={product.id}
                                                                    component={Link}
                                                                    to={`/product/${product.id}--${singleHyphenFormat(product.name)}`}
                                                                    onClick={() => setIsOpen(false)} // Closes dropdown when clicked
                                                                    sx={{
                                                                        borderBottom: '1px solid',
                                                                        borderColor: 'divider',
                                                                        '&:last-child': { borderBottom: 'none' },
                                                                        gap: 1.5,
                                                                        justifyContent: 'space-between',
                                                                    }}
                                                                >
                                                                    {/* 🖼️ Product Image */}
                                                                    <ListItemAvatar sx={{ minWidth: 'auto' }}>
                                                                        <Avatar
                                                                            variant="rounded"
                                                                            src={product.image_url || 'https://via.placeholder.com/40'}
                                                                            alt={product.name}
                                                                            sx={{ width: 44, height: 44, objectFit: 'cover' }}
                                                                        />
                                                                    </ListItemAvatar>

                                                                    {/* 📝 Product Text Details */}
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography variant="body1" noWrap color="text.primary">
                                                                                {product.name}
                                                                            </Typography>
                                                                        }
                                                                        secondary={
                                                                            <Typography variant="body2" color="primary.main" >
                                                                                ${product.price.toFixed(2)}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                    <ListItemText
                                                                        sx={{

                                                                            width: 'max-content', // 🚀 Forces width to wrap text tightly
                                                                            flex: '0 0 auto',     // 🚫 Strict lock: Do not grow, do not shrink
                                                                            textAlign: 'right',

                                                                        }}
                                                                        primary={
                                                                            <Typography variant="body1" noWrap color="text.primary">
                                                                                ${product.price.toFixed(2)}
                                                                            </Typography>
                                                                        }

                                                                    />
                                                                </ListItemButton>
                                                            ))}
                                                        </List>
                                                    )}
                                                </Paper>
                                            )}
                                        </div>
                                    </ClickAwayListener>
                                </Box>

                                {/* Spacer to push Menu and Login to the right */}
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    minWidth: 0, // hidden flexbox property to avoid expanding beyond its parent when its child is too wide
                                    flex: 1
                                }} >

                                    <ProductSlider />
                                    {/* STEP 3: MENU ICON (THIRD) */}
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        aria-label="menu"
                                        sx={{ mr: 1 }}
                                        onClick={() => navigate('/user-profile', { state: { cart: 'cart' } })}
                                    >
                                        {/* Use badge to wrap around an icon and place a small bubble */}
                                        <Badge badgeContent={cartCount || 0} color="error">
                                            <ShoppingCartOutlinedIcon sx={{ fontSize: 25 }} />
                                        </Badge>
                                    </IconButton>
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        aria-label="menu"
                                        sx={{ mr: 1 }}
                                    >
                                        <MenuIcon />
                                    </IconButton>

                                    {/* STEP 4: LOGIN/LOGOUT (LAST) */}
                                    <Box>
                                        {loading ? (
                                            // 1. Still checking localStorage? Show the spinner.
                                            <CircularProgress size={24} color="inherit" />
                                        ) : !isAuthenticated ? (
                                            // 2. Finished checking and NO user found? Show Login.
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => navigate('/login', { state: { from: location.pathname } })}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Login
                                            </Button>
                                        ) : (
                                            <IconButton
                                                size="large"
                                                edge="end"
                                                onClick={handleProfileMenuOpen}
                                                color="inherit"
                                            >
                                                <Stack direction="row" spacing={2}>
                                                    {/* <Typography>{user?.name}</Typography> */}
                                                    <Avatar src={user?.picture} sx={{

                                                    }} />
                                                    {/* <Button onClick={logout} color="inherit">Logout</Button> */}
                                                </Stack>
                                            </IconButton>
                                        )}
                                    </Box>

                                    {/* Placeholder Dropdown for Profile */}
                                    {/* The dropdown has collision (avoid edges by switching side) */}
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => { navigate('/user-profile'); handleMenuClose(); }}>Profile</MenuItem>
                                        <MenuItem onClick={() => { logout(); handleMenuClose(); }}>Logout</MenuItem>
                                    </Menu>
                                </Box>
                            </>
                        ) : <></>}
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            {/* Toolbar has a min height so you can use it as a spacer so for fixed position appbar */}
            <Toolbar />
        </Box>
    );
}