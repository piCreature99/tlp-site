import { Stack } from "@mui/material";
import CategoryBar from "./CategoryBar";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SideBanners from "./SideBanners";
import VectorCategoryBar from "./VectorCategoryBar";
import VectorProductBar from "./VectorProductsBar";

export default function Home() {

    return (
        <>
            <Navbar />
            <CategoryBar />
            <VectorCategoryBar />
            <Stack direction={'row'} sx={{
                p: 2,
            }}
                spacing={2}>
                <VectorProductBar />
                <SideBanners />
            </Stack>
            <Footer />
        </>
    );

}