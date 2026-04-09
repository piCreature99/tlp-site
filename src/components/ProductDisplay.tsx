import Grid from '@mui/material/Grid'; // Standard import
import { Container } from '@mui/material';
import ProductCard from './ProductCard';

const shuffleArray = (array: any) => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--){
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements [i] and [j]
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};

interface MockProducts {
    id: number;
    name: string;
    price: string;
    rating: number;
    image: string;
    discount:  string;
}

const MOCK_PRODUCTS : MockProducts[] = [
    { id: 1, name: "Premium Wireless Headphones", price: "$299", rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", discount: "20% OFF" },
    { id: 2, name: "Minimalist Smart Watch V2", price: "$150", rating: 4.5, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", discount: "Free Shipping" },
    { id: 3, name: "Mechanical RGB Keyboard", price: "$89", rating: 4.2, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400", discount: "New Arrival" },
    { id: 4, name: "Ultra-Wide Gaming Monitor", price: "$450", rating: 4.9, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400", discount: "Bundle Deal" },
    { id: 5, name: "Ergonomic Office Chair", price: "$210", rating: 4.0, image: "https://images.unsplash.com/photo-1505843490701-5be5d2b01cc6?w=400", discount: "Limited Stock" },
    { id: 6, name: "Leather Travel Backpack", price: "$120", rating: 4.6, image: "https://images.unsplash.com/photo-1548036654-3d603baa0bd4?w=400", discount: "Flash Sale" },
    { id: 7, name: "Noise Cancelling Earbuds", price: "$199", rating: 4.7, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", discount: "Buy 1 Get 1" },
    { id: 8, name: "Smart Home Security Camera 4K", price: "$75", rating: 4.3, image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400", discount: "Price Drop" },
];

const SHUFFLED_PRODUCTS = [
    shuffleArray(MOCK_PRODUCTS),
    shuffleArray(MOCK_PRODUCTS),
    shuffleArray(MOCK_PRODUCTS),
    shuffleArray(MOCK_PRODUCTS),
    shuffleArray(MOCK_PRODUCTS),
    shuffleArray(MOCK_PRODUCTS),
]

export default function ProductDisplay({index}: {index: number}) {
    return (
        <Container maxWidth={false} disableGutters sx={{ py: 4, px: 1,}}>
            {/* 1. Ensure 'container' is present */}
            <Grid container spacing={3}>
                {SHUFFLED_PRODUCTS[index].map((product) => (
                    /* 2. Key must be on the Grid item */
                    /* 3. 'item' prop is mandatory in v1 */
                    <Grid key={product.id} size={{ xs: 6, md: 3 }}>
                        {/* xs: 6 (take up 6 out of 12 column in grid for mobile or smallest screen or when scale the browser on desktop) */}
                        {/* md: 3 (take up 3 out of 12 column in gird for desktop screen at fullwidth*/}
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}