import { Box, Stack } from "@mui/material";
const SIDE_BANNERS = [
    { img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000", alt: "banner" },
    { img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000", alt: "banner" }
]
export default function () {
    return (
        <Stack sx={{ width: '20%', justifyContent: 'space-between'}} spacing={2}>
            {SIDE_BANNERS.map((item, i) => {
                return (
                    <Box 
                    key={`item.alt } ${i}`}
                    sx={{
                        width: '100%',
                        aspectRatio: '1 / 2', // Forces the square shape
                        maxHeight: '50%',
                        borderRadius: 1,
                        overflow: 'hidden',
                    }}>
                        <img
                            src={item.img}
                            alt={item.alt}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover' // Crops the image to fill the square
                            }}
                        />
                    </Box>
                );
            })}
        </Stack>
    );
}