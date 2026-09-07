import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Avatar,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Standard v6 import (Grid2 engine under the hood)
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderedItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderedItem[];
}

const mockOrders: Order[] = [
  {
    id: "ORD-9482",
    customerName: "Sarah Jenkins",
    customerEmail: "s.jenkins@example.com",
    date: "2026-06-08",
    total: 1249.98,
    status: "Processing",
    items: [
      { id: "p1", name: "Smart Inverter French Door Refrigerator", sku: "RF29-SMART", price: 1199.99, quantity: 1, image: "https://images.unsplash.com/photo-1571175452281-04a086c14680?w=80&q=80" },
      { id: "p2", name: "Premium Braided Stainless Steel Water Line", sku: "HOSE-SS-4FT", price: 29.99, quantity: 1, image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=80&q=80" }
    ]
  },
  {
    id: "ORD-8319",
    customerName: "Marcus Vance",
    customerEmail: "marcus.v@example.com",
    date: "2026-06-05",
    total: 649.99,
    status: "Shipped",
    items: [
      { id: "p3", name: "Heavy-Duty Digital Control Built-In Dishwasher", sku: "DW-HD800", price: 649.99, quantity: 1, image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=80&q=80" }
    ]
  },
  {
    id: "ORD-7210",
    customerName: "Elena Rostova",
    customerEmail: "elena.ros@example.com",
    date: "2026-06-02",
    total: 134.93,
    status: "Delivered",
    items: [
      { id: "p4", name: "High-Efficiency Countertop Microwave Oven", sku: "MW-CT12", price: 119.95, quantity: 1, image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=80&q=80" },
      { id: "p5", name: "Anti-Vibration Rubber Appliance Pads", sku: "PAD-AV-4P", price: 14.98, quantity: 1, image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=80&q=80" }
    ]
  }
];

const getStatusChip = (status: Order['status']) => {
  const configs = {
    Pending: { color: "warning" as const, icon: <Pending fontSize="small" /> },
    Processing: { color: "info" as const, icon: <Pending fontSize="small" /> },
    Shipped: { color: "secondary" as const, icon: <LocalShipping fontSize="small" /> },
    Delivered: { color: "success" as const, icon: <CheckCircle fontSize="small" /> },
    Cancelled: { color: "error" as const, icon: <Cancel fontSize="small" /> }
  };
  const current = configs[status] || configs.Pending;
  return <Chip label={status} color={current.color} icon={current.icon} size="small" sx={{ fontWeight: 600 }} />;
};

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="50">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{order.id}</TableCell>
        <TableCell>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.customerName}</Typography>
            <Typography variant="caption" color="text.secondary">{order.customerEmail}</Typography>
          </Box>
        </TableCell>
        <TableCell>{order.date}</TableCell>
        <TableCell sx={{ fontWeight: 700 }}>${order.total.toFixed(2)}</TableCell>
        <TableCell>{getStatusChip(order.status)}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 3, pb: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'primary.main', letterSpacing: 0.5, mb: 2 }}>
                Items Ordered ({order.items.length})
              </Typography>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table size="small">
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
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={item.image} alt={item.name} variant="rounded" sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, maxWidth: 300 }} noWrap>
                              {item.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell><Box component="code" sx={{ bgcolor: 'action.selected', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontFamily: 'monospace' }}>{item.sku}</Box></TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{item.quantity}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function OrderManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = mockOrders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack spacing={4}>
      {/* Header and Search Actions */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            Order Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor incoming processing orders, shipments, and customer item logs.
          </Typography>
        </Box>

        <TextField
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
        />
      </Box>

      {/* 📊 Metrics Summary Grid */}
      <Grid container spacing={3}>
        {[
          { label: "Total Revenue", value: "$2,034.90", color: 'primary.main' },
          { label: "Active Processing", value: "1 Order", color: 'info.main' },
          { label: "Dispatched & Shipped", value: "1 Order", color: 'secondary.main' },
        ].map((metric, idx) => (
          <Grid size={{ xs: 12, sm: 4 }} key={idx}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderLeft: '4px solid', borderColor: metric.color }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {metric.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 🗄️ Primary Table Canvas */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell width="50" />
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.85rem' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.85rem' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.85rem' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.85rem' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.85rem' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No matching orders located in current session logs.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}