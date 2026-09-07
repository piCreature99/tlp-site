import React from 'react';
import { Pagination, Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';

// 1. The Interface
interface ProductPaginationProps {
    page: number;
    totalPages: number;
    // MUI's onChange signature: (event: React.ChangeEvent<unknown>, value: number) => void
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

// 2. The Functional Component with Types
export default function ProductPagination({
    page,
    totalPages,
    onPageChange
}: ProductPaginationProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <Stack spacing={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={onPageChange}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                    />
                </Stack>
            </motion.div>
        </Box>
    );
};