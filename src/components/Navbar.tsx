import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    MenuItem,
    Menu,
    Button,
    useScrollTrigger,
    Slide,
    Badge,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ProductSlider from './ProductSlider';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
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

function HideOnScroll(props: { children: React.ReactElement }) {
    const { children } = props;

    // useScrollTrigger returns 'true' when scrolling down
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {/* direction="down" here means to slide down into view */}
            {/* appear={false} means when the pages first loads, don't pay the animation, this ensures yor navbar is just there immediately when the user lands
            on the site, rather than sliding in from the ceiling */}
            {/* in prop detect trigger, if it's true (user scrolling) the component is slided off and vice versa */}
            {children}
        </Slide>
    );
}

export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // useScrollTrigger returns 'true' when scrolling down

    const { cart } = useCart();

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    return (
        <Box sx={{}}>
            <HideOnScroll>

                <AppBar position="fixed" sx={{ backgroundColor: 'primary.main' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>

                        {/* STEP 1: COMPANY LOGO (FIRST) */}
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ fontWeight: 'bold', cursor: 'pointer', mr: 2 }}
                        >
                            COMPANY
                        </Typography>

                        {/* STEP 2: SEARCH BAR (SECOND & LONGER) */}
                        <Search sx={{}}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search products, services..."
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>

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
                            >
                                {/* Use badge to wrap around an icon and place a small bubble */}
                                <Badge badgeContent={cart.length} color="error">
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
                                {!isLoggedIn ? (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setIsLoggedIn(true)}
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
                                        <AccountCircle />
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
                                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                                <MenuItem onClick={() => { setIsLoggedIn(false); handleMenuClose(); }}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            {/* Toolbar has a min height so you can use it as a spacer so for fixed position appbar */}
            <Toolbar />
        </Box>
    );
}