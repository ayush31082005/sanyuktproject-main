import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Filter, Eye, Edit, Truck, Clock, CheckCircle, AlertCircle, XCircle, RotateCcw, Package } from 'lucide-react';
import api from '../../api';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip,
    IconButton, TextField, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Select, InputLabel, FormControl
} from '@mui/material';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Order Detail Dialog
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

    // Status Update Dialog
    const [openStatusUpdate, setOpenStatusUpdate] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    async function fetchOrders() {
        try {
            const res = await api.get('/orders/admin/all');
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/orders/admin/${selectedOrder._id}`, {
                status: newStatus,
                message: statusMessage
            });
            setOpenStatusUpdate(false);
            setNewStatus('');
            setStatusMessage('');
            fetchOrders(); // Refresh
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            pending: { bg: 'rgba(212,175,55,0.2)', color: '#D4AF37', label: 'Pending' },
            processing: { bg: 'rgba(100,149,237,0.2)', color: '#6495ED', label: 'Processing' },
            shipped: { bg: 'rgba(200,169,106,0.3)', color: '#C8A96A', label: 'Shipped' },
            reached_store: { bg: 'rgba(186,85,211,0.2)', color: '#BA55D3', label: 'Reached Store' },
            out_for_delivery: { bg: 'rgba(32,178,170,0.2)', color: '#20B2AA', label: 'Out for Delivery' },
            delivered: { bg: 'rgba(46,139,87,0.3)', color: '#8FBC8F', label: 'Delivered' },
            cancelled: { bg: 'rgba(239,68,68,0.2)', color: '#ef4444', label: 'Cancelled' },
            backorder: { bg: 'rgba(239,68,68,0.2)', color: '#ef4444', label: 'Backorder' }
        };
        const config = statusConfig[status] || { bg: 'rgba(245,230,200,0.1)', color: '#F5E6C8', label: status };
        return <Chip label={config.label} sx={{ bgcolor: config.bg, color: config.color, fontWeight: 700, fontFamily: 'sans-serif', border: `1px solid ${config.color}40`, padding: '0 4px', fontSize: '0.75rem', height: '24px' }} />;
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#0D0D0D', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 800, color: '#F5E6C8', fontFamily: 'serif', letterSpacing: '-0.5px' }}>
                    <div style={{ padding: '10px', background: '#121212', borderRadius: '12px', border: '1px solid rgba(200,169,106,0.3)', display: 'flex', color: '#C8A96A' }}>
                        <ShoppingBag size={28} strokeWidth={1.5} />
                    </div>
                    Order Management
                </Typography>
                <Button variant="outlined" startIcon={<RotateCcw size={16} />} onClick={fetchOrders} sx={{ color: '#C8A96A', borderColor: 'rgba(200,169,106,0.5)', '&:hover': { bgcolor: 'rgba(200,169,106,0.1)', borderColor: '#C8A96A' }, fontWeight: 700, borderRadius: '8px', padding: '8px 20px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px' }}>
                    Refresh
                </Button>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 3, mb: 4, display: 'flex', gap: 3, alignItems: 'center', borderRadius: '16px', bgcolor: '#121212', border: '1px solid rgba(200,169,106,0.2)', flexWrap: 'wrap', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <TextField
                    placeholder="Search by Order ID or User..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ 
                        flexGrow: 1, 
                        minWidth: '250px',
                        '& .MuiOutlinedInput-root': {
                            color: '#F5E6C8',
                            bgcolor: '#0D0D0D',
                            '& fieldset': { borderColor: 'rgba(200,169,106,0.3)', borderRadius: '10px' },
                            '&:hover fieldset': { borderColor: 'rgba(200,169,106,0.6)' },
                            '&.Mui-focused fieldset': { borderColor: '#C8A96A', borderWidth: '1px' },
                        },
                        '& .MuiInputBase-input::placeholder': { color: 'rgba(245,230,200,0.3)', opacity: 1 }
                    }}
                    InputProps={{
                        startAdornment: <Search size={18} color="rgba(200,169,106,0.6)" style={{ marginRight: 10 }} />
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{ color: 'rgba(200,169,106,0.8)', '&.Mui-focused': { color: '#C8A96A' } }}>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ 
                            color: '#F5E6C8',
                            bgcolor: '#0D0D0D',
                            borderRadius: '10px',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(200,169,106,0.3)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(200,169,106,0.6)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C8A96A', borderWidth: '1px' },
                            '& .MuiSvgIcon-root': { color: '#C8A96A' }
                        }}
                        MenuProps={{ PaperProps: { sx: { bgcolor: '#121212', border: '1px solid rgba(200,169,106,0.2)', color: '#F5E6C8' } } }}
                    >
                        <MenuItem value="all">All Orders</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="reached_store">Reached Store</MenuItem>
                        <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                        <MenuItem value="backorder">Backorder</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden', bgcolor: '#121212', border: '1px solid rgba(200,169,106,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#0a0a0a', borderBottom: '2px solid rgba(200,169,106,0.2)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: '#C8A96A', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', borderBottom: 'none', py: 2.5 }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#C8A96A', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', borderBottom: 'none' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#C8A96A', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', borderBottom: 'none' }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#C8A96A', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', borderBottom: 'none' }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#C8A96A', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', borderBottom: 'none' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#C8A96A', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', borderBottom: 'none' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#C8A96A', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', borderBottom: 'none' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 8, borderBottom: 'none' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                                        <Package size={48} color="#C8A96A" style={{ marginBottom: 16 }} />
                                        <Typography sx={{ color: '#F5E6C8', fontFamily: 'serif', fontSize: '18px' }}>No Orders Found</Typography>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order._id} hover sx={{ '&:hover': { bgcolor: 'rgba(200,169,106,0.03) !important' }, transition: 'background-color 0.2s' }}>
                                    <TableCell sx={{ fontWeight: 700, color: '#F5E6C8', borderBottom: '1px solid rgba(200,169,106,0.1)' }}>#{order._id.slice(-8).toUpperCase()}</TableCell>
                                    <TableCell sx={{ color: 'rgba(245,230,200,0.8)', borderBottom: '1px solid rgba(200,169,106,0.1)' }}>{order.user?.name || 'Customer'}</TableCell>
                                    <TableCell sx={{ color: 'rgba(245,230,200,0.8)', borderBottom: '1px solid rgba(200,169,106,0.1)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.product?.name || 'Product'}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#10b981', borderBottom: '1px solid rgba(200,169,106,0.1)' }}>₹{order.total?.toFixed(2)}</TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid rgba(200,169,106,0.1)' }}>{getStatusChip(order.status)}</TableCell>
                                    <TableCell sx={{ color: 'rgba(245,230,200,0.6)', fontSize: '12px', borderBottom: '1px solid rgba(200,169,106,0.1)' }}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(200,169,106,0.1)' }}>
                                        <IconButton size="small" onClick={() => { setSelectedOrder(order); setOpenDetail(true); }} sx={{ color: 'rgba(200,169,106,0.7)', '&:hover': { color: '#C8A96A', bgcolor: 'rgba(200,169,106,0.1)' }, mr: 1 }}>
                                            <Eye size={18} />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setOpenStatusUpdate(true); }} sx={{ color: 'rgba(200,169,106,0.7)', '&:hover': { color: '#C8A96A', bgcolor: 'rgba(200,169,106,0.1)' } }}>
                                            <Edit size={18} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Order Details Dialog */}
            <Dialog 
                open={openDetail} 
                onClose={() => setOpenDetail(false)} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: { bgcolor: '#121212', borderRadius: '16px', border: '1px solid rgba(200,169,106,0.3)', color: '#F5E6C8', backgroundImage: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid rgba(200,169,106,0.15)', pb: 2, pt: 3, display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'serif', fontSize: '22px' }}>
                    <div style={{ padding: '8px', background: 'rgba(200,169,106,0.1)', borderRadius: '8px', display: 'flex', color: '#C8A96A' }}>
                        <Package size={20} />
                    </div>
                    Order Details <span style={{ color: 'rgba(245,230,200,0.4)', fontWeight: 400, fontSize: '18px' }}>#{selectedOrder?._id?.slice(-8).toUpperCase()}</span>
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    {selectedOrder && (
                        <Box sx={{ py: 1 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
                                <div>
                                    <Typography variant="subtitle2" sx={{ color: '#C8A96A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', mb: 2 }}>Customer Info</Typography>
                                    <Typography variant="body2" sx={{ color: '#F5E6C8', mb: 1 }}><strong>Name:</strong> <span style={{ color: 'rgba(245,230,200,0.7)' }}>{selectedOrder.user?.name}</span></Typography>
                                    <Typography variant="body2" sx={{ color: '#F5E6C8', mb: 1 }}><strong>Email:</strong> <span style={{ color: 'rgba(245,230,200,0.7)' }}>{selectedOrder.user?.email}</span></Typography>
                                    <Typography variant="body2" sx={{ color: '#F5E6C8', mb: 1 }}><strong>Phone:</strong> <span style={{ color: 'rgba(245,230,200,0.7)' }}>{selectedOrder.shippingInfo?.phone}</span></Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle2" sx={{ color: '#C8A96A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', mb: 2 }}>Shipping Info</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(245,230,200,0.7)', mb: 1, lineHeight: 1.6 }}>{selectedOrder.shippingInfo?.address}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(245,230,200,0.7)', mb: 1 }}>{selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state}</Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(245,230,200,0.7)', mb: 1 }}>{selectedOrder.shippingInfo?.pincode}</Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle2" sx={{ color: '#C8A96A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', mb: 2 }}>Payment Info</Typography>
                                    <Typography variant="body2" sx={{ color: '#F5E6C8', mb: 1.5 }}><strong>Method:</strong> <span style={{ color: 'rgba(245,230,200,0.7)', textTransform: 'uppercase' }}>{selectedOrder.paymentMethod}</span></Typography>
                                    <Typography variant="body2" sx={{ color: '#F5E6C8', display: 'flex', alignItems: 'center', gap: 1 }}><strong>Status:</strong> {getStatusChip(selectedOrder.status)}</Typography>
                                </div>
                                <div>
                                    <Typography variant="subtitle2" sx={{ color: '#C8A96A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', mb: 2 }}>Order Info</Typography>
                                    <Typography variant="body2" sx={{ color: '#F5E6C8', mb: 1 }}><strong>Total:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>₹{selectedOrder.total?.toFixed(2)}</span></Typography>
                                    <Typography variant="body2" sx={{ color: '#F5E6C8', mb: 1 }}><strong>Date:</strong> <span style={{ color: 'rgba(245,230,200,0.7)' }}>{new Date(selectedOrder.createdAt).toLocaleString()}</span></Typography>
                                </div>
                            </div>

                            <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(200,169,106,0.1)' }}>
                                <Typography variant="subtitle1" sx={{ color: '#F5E6C8', fontWeight: 700, fontFamily: 'serif', fontSize: '20px', mb: 3 }}>Tracking History</Typography>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {selectedOrder.tracking?.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: 'rgba(200,169,106,0.03)', borderRadius: '12px', border: '1px solid rgba(200,169,106,0.1)' }}>
                                            <div style={{ padding: '8px', background: 'rgba(200,169,106,0.1)', borderRadius: '50%', border: '1px solid rgba(200,169,106,0.2)' }}>
                                                <Clock size={16} color="#C8A96A" />
                                            </div>
                                            <div>
                                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#C8A96A', textTransform: 'capitalize', mb: 0.5 }}>{item.status.replace(/_/g, ' ')}</Typography>
                                                <Typography variant="caption" sx={{ color: 'rgba(245,230,200,0.4)', fontSize: '11px', display: 'block', mb: 1 }}>{new Date(item.timestamp).toLocaleString()}</Typography>
                                                <Typography variant="body2" sx={{ color: 'rgba(245,230,200,0.8)', lineHeight: 1.5 }}>{item.message}</Typography>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(200,169,106,0.1)' }}>
                    <Button onClick={() => setOpenDetail(false)} sx={{ color: '#C8A96A', fontWeight: 700, letterSpacing: '1px', fontSize: '11px' }}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Status Update Dialog */}
            <Dialog 
                open={openStatusUpdate} 
                onClose={() => setOpenStatusUpdate(false)}
                PaperProps={{
                    sx: { borderRadius: '20px', p: 1, minWidth: { xs: 300, sm: 450 }, bgcolor: '#121212', border: '1px solid rgba(200,169,106,0.3)', color: '#F5E6C8', backgroundImage: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)' }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, fontFamily: 'serif', pb: 1, pt: 3, fontSize: '24px' }}>
                    Update Order Status
                </DialogTitle>
                <DialogContent>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'rgba(245,230,200,0.5)', mb: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Transition order to a new phase
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="status-select-label-2" sx={{ color: 'rgba(200,169,106,0.8)', '&.Mui-focused': { color: '#C8A96A' } }}>New Status</InputLabel>
                            <Select
                                labelId="status-select-label-2"
                                value={newStatus}
                                label="New Status"
                                onChange={(e) => setNewStatus(e.target.value)}
                                sx={{ 
                                    borderRadius: '12px', fontWeight: 600, color: '#F5E6C8', bgcolor: '#0D0D0D',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(200,169,106,0.3)' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(200,169,106,0.6)' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C8A96A', borderWidth: '1px' },
                                    '& .MuiSvgIcon-root': { color: '#C8A96A' }
                                }}
                                MenuProps={{ PaperProps: { sx: { bgcolor: '#121212', border: '1px solid rgba(200,169,106,0.2)', color: '#F5E6C8' } } }}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="reached_store">Reached Store</MenuItem>
                                <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                <MenuItem value="backorder">Backorder</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Tracking Message (Optional)"
                            multiline
                            rows={3}
                            fullWidth
                            value={statusMessage}
                            onChange={(e) => setStatusMessage(e.target.value)}
                            placeholder="e.g., Package has arrived at local hub..."
                            InputProps={{
                                sx: { 
                                    borderRadius: '12px', color: '#F5E6C8', bgcolor: '#0D0D0D',
                                    '& fieldset': { borderColor: 'rgba(200,169,106,0.3)' },
                                    '&:hover fieldset': { borderColor: 'rgba(200,169,106,0.6)' },
                                    '&.Mui-focused fieldset': { borderColor: '#C8A96A', borderWidth: '1px' },
                                }
                            }}
                            InputLabelProps={{ sx: { color: 'rgba(200,169,106,0.8)', '&.Mui-focused': { color: '#C8A96A' } } }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                        onClick={() => setOpenStatusUpdate(false)}
                        sx={{ color: '#C8A96A', fontWeight: 700, textTransform: 'uppercase', px: 3, fontSize: '11px', letterSpacing: '1px' }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdateStatus} 
                        variant="outlined" 
                        sx={{ 
                            color: '#C8A96A', borderColor: 'rgba(200,169,106,0.5)',
                            borderRadius: '8px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            px: 4,
                            fontSize: '11px',
                            letterSpacing: '1px',
                            '&:hover': { bgcolor: 'rgba(200,169,106,0.1)', borderColor: '#C8A96A' },
                        }}
                    >
                        Update Phase
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminOrders;
