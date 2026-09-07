import { TableRow, TableCell, Collapse, Box, Typography, Paper, Table, TableHead, TableBody, Stack, Avatar, TextField, TableContainer } from '@mui/material';
import React from 'react';
import type { CartItem } from './CartContext';


export default function Cart({ items }: { items: CartItem[] }) {
    return (
        <Stack spacing={4}>
            {/* Header and Search Actions */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                        Your Cart
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitor items in your cart.
                    </Typography>
                </Box>

                {/* <TextField
                    placeholder="Search by ID, name, or email..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ maxWidth: 350, width: '100%' }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                        }
                    }}
                /> */}
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Qty</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Stack direction="row" spacing={2}>
                                        <Avatar src={item.image_url} alt={item.name} variant="rounded" sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 300 }} noWrap>
                                            {item.name}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell><Box component="code" sx={{ bgcolor: 'action.selected', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontFamily: 'monospace' }}>{item.name}</Box></TableCell>
                                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>{item.quantity}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    )
}