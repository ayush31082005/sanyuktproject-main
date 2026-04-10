import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { API_URL } from "../api";
import CartPage from './Cart';

// Material-UI imports
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagIcon from '@mui/icons-material/Flag';
import VillaIcon from '@mui/icons-material/Villa';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GroupsIcon from '@mui/icons-material/Groups';
import WcIcon from '@mui/icons-material/Wc';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingIcon from '@mui/icons-material/Pending';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShieldIcon from '@mui/icons-material/Shield';

// ─── Styled Components ───────────────────────────────────────────────────────

const AnimatedCard = styled(Card)(() => ({
    transition: 'all 0.3s ease-in-out',
    height: '100%',
    backgroundColor: '#1A1A1A',
    border: '1px solid rgba(200, 169, 106, 0.1)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(200, 169, 106, 0.15)',
        borderColor: 'rgba(200, 169, 106, 0.3)',
    },
}));

const AnimatedPaper = styled(Paper)(() => ({
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    borderRadius: '24px',
    backgroundColor: '#1A1A1A',
    border: '1px solid rgba(200, 169, 106, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    '&:hover': {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        transform: 'translateY(-2px)',
    },
}));

const FullPageContainer = styled(Box)(({ theme }) => ({
    height: 'calc(100vh - 60px)',
    width: '100%',
    background: '#0D0D0D',
    position: 'relative',
    overflow: 'hidden',
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: { padding: theme.spacing(2) },
    [theme.breakpoints.up('md')]: { height: 'calc(100vh - 80px)', padding: theme.spacing(3) },
    display: 'flex',
    flexDirection: 'column',
}));

const StatusChip = styled(Chip)(({ status }) => ({
    fontWeight: 700,
    borderRadius: '10px',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    padding: '4px 2px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
    ...(status === 'Pending' && { backgroundColor: 'rgba(247, 147, 30, 0.1)', color: '#C8A96A', border: '1px solid rgba(247, 147, 30, 0.3)' }),
    ...(status === 'In Progress' && { backgroundColor: 'rgba(200, 169, 106, 0.1)', color: '#C8A96A', border: '1px solid rgba(200, 169, 106, 0.3)' }),
    ...(status === 'Resolved' && { backgroundColor: 'rgba(200, 169, 106, 0.2)', color: '#C8A96A', border: '1px solid #C8A96A' }),
    ...(status === 'Verified' && { backgroundColor: 'rgba(200, 169, 106, 0.2)', color: '#C8A96A', border: '1px solid #C8A96A' }),
}));

// ─── Main Component ───────────────────────────────────────────────────────────

const MyAccount = ({ defaultTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const pathToTab = {
        '/my-account': 0, '/my-account/profile': 0, '/my-account/address': 1,
        '/my-account/orders': 2, '/my-account/transactions': 3,
        '/my-account/grievances': 4, '/my-account/kyc': 5, '/my-account/cart': -1,
    };
    const tabValue = defaultTab !== undefined ? defaultTab : (pathToTab[location.pathname] ?? 0);
    const setTabValue = (index) => {
        const tabPaths = ['/my-account/profile', '/my-account/address', '/my-account/orders', '/my-account/transactions', '/my-account/grievances', '/my-account/kyc'];
        navigate(tabPaths[index] || '/my-account/profile');
    };

    // ── Core State ──
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [userGrievances, setUserGrievances] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [userTransactions, setUserTransactions] = useState([]);
    const [grievancesLoading, setGrievancesLoading] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showContent, setShowContent] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    // ── Wallet Transaction State ──
    const [allWalletTransactions, setAllWalletTransactions] = useState([]);
    const [walletTxLoading, setWalletTxLoading] = useState(false);
    const [walletTxError, setWalletTxError] = useState(null);
    const [walletTxSearch, setWalletTxSearch] = useState('');
    const [walletTxFilter, setWalletTxFilter] = useState('All');
    const [walletTxPage, setWalletTxPage] = useState(1);
    const [orderHistPage, setOrderHistPage] = useState(1);
    const [rechargeHistPage, setRechargeHistPage] = useState(1);
    const WALLET_TX_PER_PAGE = 10;

    // ── KYC State ──
    const [kycData, setKycData] = useState({
        aadharNumber: '',
        panNumber: '',
        nominee: { name: '', relation: '', dob: '', address: '', state: '', city: '' },
        bankDetails: { accountNumber: '', ifscCode: '', bankName: '', accountType: '', panNumber: '' },
        kycDocuments: { aadharFront: '', aadharBack: '', panCard: '', passbook: '' }
    });
    const [kycSubmitting, setKycSubmitting] = useState(false);
    const kycReadOnly = userData?.kycStatus === 'Submitted' || userData?.kycStatus === 'Verified';

    // ── Orders UI ──
    const [orderSearchQuery, setOrderSearchQuery] = useState('');
    const [orderTab, setOrderTab] = useState('All Orders');
    const [showAllOrders, setShowAllOrders] = useState(false);

    // ─── Handlers ──────────────────────────────────────────────────────────────

    const handleEditStart = () => {
        setEditData({
            userName: userData.userName || '',
            fatherName: userData.fatherName || '',
            mobile: userData.mobile || '',
            gender: userData.gender || '',
            dob: userData.dob ? new Date(userData.dob).toISOString().slice(0, 10) : '',
            qualification: userData.qualification || '',
            shippingAddress: userData.shippingAddress || ''
        });
        setEditMode(true);
    };
    const handleEditCancel = () => { setEditMode(false); setEditData({}); };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const payload = { ...editData };
            if (profileImage) payload.profileImage = profileImage;
            const res = await api.put('/profile', payload);
            const updatedUser = res.data.user;
            applyUserProfile(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage'));
            setEditMode(false);
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update profile', severity: 'error' });
        } finally { setSaving(false); }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleKycImageUpload = (e, docType) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setKycData(prev => ({ ...prev, kycDocuments: { ...prev.kycDocuments, [docType]: reader.result } }));
        reader.readAsDataURL(file);
    };

    const handleKycSubmit = async () => {
        if (
            !kycData.aadharNumber ||
            !kycData.panNumber ||
            !kycData.nominee.name ||
            !kycData.nominee.relation ||
            !kycData.nominee.dob ||
            !kycData.nominee.address ||
            !kycData.nominee.state ||
            !kycData.nominee.city ||
            !kycData.bankDetails.accountNumber ||
            !kycData.bankDetails.ifscCode ||
            !kycData.bankDetails.bankName ||
            !kycData.bankDetails.accountType ||
            !kycData.bankDetails.panNumber
        ) {
            setSnackbar({ open: true, message: 'Please fill all required KYC fields including nominee and bank details', severity: 'warning' });
            return;
        }
        setKycSubmitting(true);
        try {
            const res = await api.put('/kyc', kycData);
            const updatedUser = res.data.user;
            applyUserProfile(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSnackbar({ open: true, message: 'KYC submitted successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to submit KYC', severity: 'error' });
        } finally { setKycSubmitting(false); }
    };

    // ─── Fetch Functions ────────────────────────────────────────────────────────

    const fetchUserOrders = async () => {
        setOrdersLoading(true);
        try { const res = await api.get('/orders/myorders'); setUserOrders(res.data || []); }
        catch (e) { console.error("Error fetching orders:", e); }
        finally { setOrdersLoading(false); }
    };

    const fetchUserGrievances = async (email) => {
        if (!email) return;
        setGrievancesLoading(true);
        try {
            const res = await api.get(`/grievance/user/${email}`);
            if (res.data.success) setUserGrievances(res.data.grievances || []);
        } catch (e) {
            console.error("Error fetching grievances:", e);
            setSnackbar({ open: true, message: 'Error fetching your grievances', severity: 'error' });
        } finally { setGrievancesLoading(false); }
    };

    const fetchUserTransactions = async () => {
        setWalletTxLoading(true);
        try { const res = await api.get('/recharge/my-transactions'); setUserTransactions(res.data || []); }
        catch (e) { console.error("Error fetching transactions:", e); }
        finally { setWalletTxLoading(false); }
    };

    // ── Wallet Transactions API (NEW) ──
    const fetchAllWalletTransactions = async () => {
        setWalletTxLoading(true);
        setWalletTxError(null);
        try {
            const res = await api.get('/wallet/all-transactions');
            if (res.data.success) setAllWalletTransactions(res.data.transactions || []);
        } catch (e) {
            console.error("Error fetching wallet transactions:", e);
            setWalletTxError('Wallet transactions load nahi ho sake.');
        } finally { setWalletTxLoading(false); }
    };

    const applyUserProfile = (parsedUser) => {
        setUserData(parsedUser);
        setProfileImage(parsedUser.profileImage || null);
        setKycData({
            aadharNumber: parsedUser.aadharNumber || '',
            panNumber: parsedUser.panNumber || '',
            nominee: {
                name: parsedUser.nominee?.name || '',
                relation: parsedUser.nominee?.relation || '',
                dob: parsedUser.nominee?.dob ? new Date(parsedUser.nominee.dob).toISOString().slice(0, 10) : '',
                address: parsedUser.nominee?.address || '',
                state: parsedUser.nominee?.state || '',
                city: parsedUser.nominee?.city || ''
            },
            bankDetails: {
                accountNumber: parsedUser.bankDetails?.accountNumber || '',
                ifscCode: parsedUser.bankDetails?.ifscCode || '',
                bankName: parsedUser.bankDetails?.bankName || '',
                accountType: parsedUser.bankDetails?.accountType || '',
                panNumber: parsedUser.bankDetails?.panNumber || parsedUser.bankDetails?.apnNumber || ''
            },
            kycDocuments: parsedUser.kycDocuments || { aadharFront: '', aadharBack: '', panCard: '', passbook: '' }
        });
    };

    // ─── useEffect ──────────────────────────────────────────────────────────────

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (!token || !user) { navigate('/login'); return; }
        const syncLatestProfile = async () => {
            try {
                const res = await api.get('/profile');
                const latestUser = res.data?.user || res.data;
                if (latestUser) {
                    applyUserProfile(latestUser);
                    localStorage.setItem('user', JSON.stringify(latestUser));
                }
            } catch (e) {
                console.error('Error syncing profile:', e);
            }
        };
        try {
            const parsedUser = JSON.parse(user);
            applyUserProfile(parsedUser);
            fetchUserGrievances(parsedUser.email);
            fetchUserOrders();
            fetchUserTransactions();
            syncLatestProfile();
            fetchAllWalletTransactions(); // ← Wallet API call
            setTimeout(() => setShowContent(true), 300);
        } catch (e) { console.error('Error parsing user:', e); localStorage.clear(); navigate('/login'); }
        finally { setLoading(false); }
    }, []);

    // ─── Helpers ────────────────────────────────────────────────────────────────

    const handleLogout = () => {
        localStorage.removeItem('token'); localStorage.removeItem('user');
        setSnackbar({ open: true, message: 'Logged out successfully!', severity: 'success' });
        setTimeout(() => navigate('/login'), 1500);
    };

    const getDisplayName = () => {
        if (!userData) return 'User';
        return userData.userName || userData.name || userData.email?.split('@')[0] || 'User';
    };

    const formatValue = (v) => (v === undefined || v === null || v === '') ? 'Not provided' : v;
    const formatDateValue = (value) => {
        if (!value) return 'Not provided';
        const parsedDate = new Date(value);
        if (Number.isNaN(parsedDate.getTime())) return 'Not provided';
        return parsedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <PendingIcon />;
            case 'In Progress': return <HistoryIcon />;
            case 'Resolved': return <CheckCircleIcon />;
            default: return <AssignmentIcon />;
        }
    };

    // ── Filtered wallet transactions ──
    const filteredWalletTx = allWalletTransactions.filter(txn => {
        const matchesFilter = walletTxFilter === 'All' || txn.txType === walletTxFilter.toLowerCase();
        const q = walletTxSearch.toLowerCase();
        const matchesSearch = !q || txn.type?.toLowerCase().includes(q) || txn.source?.toLowerCase().includes(q) || txn.details?.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });

    // ─── KYC Form ───────────────────────────────────────────────────────────────

    const renderKycForm = () => (
        <Box>
            <Paper variant="outlined" sx={{ borderRadius: '14px', p: 2.5, mb: 4, bgcolor: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#F5E6C8' }}>Verification Status</Typography>
                    <Typography variant="body2" color="textSecondary">Your KYC application status</Typography>
                </Box>
                <StatusChip label={userData.kycStatus || 'Pending'} status={userData.kycStatus || 'Pending'}
                    sx={{ px: 2, py: 2.5, fontSize: '0.9rem', borderRadius: '8px', ...(userData.kycStatus === 'Verified' && { bgcolor: '#C8A96A', color: 'white' }), ...(userData.kycStatus === 'Rejected' && { bgcolor: '#d32f2f', color: 'white' }), ...(userData.kycStatus === 'Submitted' && { bgcolor: '#C8A96A', color: 'white' }), ...(!userData.kycStatus && { bgcolor: '#757575', color: 'white' }) }} />
            </Paper>

            {userData.kycMessage && userData.kycStatus === 'Rejected' && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: '10px' }}>
                    <strong>Rejection Reason:</strong> {userData.kycMessage}
                </Alert>
            )}

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#F5E6C8' }}>Nominee Details</Typography>
            <Paper variant="outlined" sx={{ borderRadius: '12px', p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nominee Name"
                            value={kycData.nominee.name}
                            onChange={(e) => setKycData({ ...kycData, nominee: { ...kycData.nominee, name: e.target.value } })}
                            disabled={kycReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nominee Relation"
                            placeholder="e.g., Father, Mother, Wife, Brother"
                            value={kycData.nominee.relation}
                            onChange={(e) => setKycData({ ...kycData, nominee: { ...kycData.nominee, relation: e.target.value } })}
                            disabled={kycReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nominee DOB"
                            type="date"
                            value={kycData.nominee.dob}
                            onChange={(e) => setKycData({ ...kycData, nominee: { ...kycData.nominee, dob: e.target.value } })}
                            disabled={kycReadOnly}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nominee Address"
                            value={kycData.nominee.address}
                            onChange={(e) => setKycData({ ...kycData, nominee: { ...kycData.nominee, address: e.target.value } })}
                            disabled={kycReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nominee State"
                            value={kycData.nominee.state}
                            onChange={(e) => setKycData({ ...kycData, nominee: { ...kycData.nominee, state: e.target.value } })}
                            disabled={kycReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Nominee City"
                            value={kycData.nominee.city}
                            onChange={(e) => setKycData({ ...kycData, nominee: { ...kycData.nominee, city: e.target.value } })}
                            disabled={kycReadOnly}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#F5E6C8' }}>Bank Information</Typography>
            <Paper variant="outlined" sx={{ borderRadius: '12px', p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Account Number" value={kycData.bankDetails.accountNumber} onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, accountNumber: e.target.value } })} disabled={kycReadOnly} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="IFSC Code" value={kycData.bankDetails.ifscCode} onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, ifscCode: e.target.value.toUpperCase() } })} disabled={kycReadOnly} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Bank Name" value={kycData.bankDetails.bankName} onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, bankName: e.target.value } })} disabled={kycReadOnly} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Account Type"
                            placeholder="e.g., Savings / Current"
                            value={kycData.bankDetails.accountType}
                            onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, accountType: e.target.value } })}
                            disabled={kycReadOnly}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="PAN Number"
                            value={kycData.bankDetails.panNumber}
                            onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, panNumber: e.target.value.toUpperCase() } })}
                            disabled={kycReadOnly}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F5E6C8' }}>Document Proofs</Typography>
                <Chip label="JPG, PNG" size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 600, bgcolor: 'rgba(200, 169, 106, 0.1)', color: '#C8A96A' }} />
            </Box>
            <Paper variant="outlined" sx={{ borderRadius: '12px', p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    {['aadharFront', 'aadharBack', 'panCard', 'passbook'].map((docType) => (
                        <Grid item xs={12} sm={6} md={3} key={docType}>
                            <Box sx={{ border: '2px dashed rgba(200, 169, 106, 0.2)', borderRadius: '12px', p: 2, textAlign: 'center', position: 'relative', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: kycData.kycDocuments[docType] ? '#fff' : '#fafafa', transition: 'all 0.2s', '&:hover': { borderColor: '#C8A96A', bgcolor: 'rgba(200, 169, 106, 0.05)' } }}>
                                {kycData.kycDocuments[docType] ? (
                                    <>
                                        <img src={kycData.kycDocuments[docType]} alt={docType} style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                                        {!kycReadOnly && (
                                            <IconButton size="small" sx={{ position: 'absolute', top: -8, right: -8, bgcolor: '#1A1A1A', border: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '', '&:hover': { bgcolor: '#ffebee' } }}
                                                onClick={() => setKycData({ ...kycData, kycDocuments: { ...kycData.kycDocuments, [docType]: '' } })}>
                                                <CancelIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                            </IconButton>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <CameraAltIcon sx={{ color: '#bdbdbd', fontSize: 36, mb: 1.5 }} />
                                        <Typography variant="body2" sx={{ color: '#C8A96A', fontWeight: 500, mb: 1.5 }}>
                                            {docType.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                                        </Typography>
                                        {!kycReadOnly && (
                                            <Button component="label" size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: '6px', px: 2, color: '#C8A96A', borderColor: '#C8A96A' }}>
                                                Upload
                                                <input type="file" hidden accept="image/*" onChange={(e) => handleKycImageUpload(e, docType)} />
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {!kycReadOnly && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" size="large" onClick={handleKycSubmit} disabled={kycSubmitting}
                        startIcon={kycSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                        sx={{ bgcolor: '#C8A96A', '&:hover': { bgcolor: 'rgba(200,169,106,0.8)' }, py: 1.5, px: 4, borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                        {kycSubmitting ? 'Submitting...' : 'Submit KYC Details'}
                    </Button>
                </Box>
            )}
        </Box>
    );

    // ─── Loading / No User ──────────────────────────────────────────────────────

    if (loading) {
        return (
            <FullPageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Zoom in={true} timeout={1000}>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress size={isMobile ? 50 : 60} thickness={4} sx={{ color: '#C8A96A' }} />
                        <Typography variant={isMobile ? "body1" : "h6"} sx={{ mt: 2, color: '#C8A96A', fontWeight: 500 }}>Loading your profile...</Typography>
                    </Box>
                </Zoom>
            </FullPageContainer>
        );
    }

    if (!userData) {
        return (
            <FullPageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Fade in={true} timeout={1000}>
                    <Paper sx={{ p: isMobile ? 3 : 4, textAlign: 'center', borderRadius: '16px', maxWidth: '500px', width: '100%', margin: '0 auto' }}>
                        <Typography variant={isMobile ? "body1" : "h6"} color="error" gutterBottom>No user data found. Please login again.</Typography>
                        <Button variant="contained" sx={{ mt: 2, bgcolor: '#C8A96A' }} onClick={() => navigate('/login')}>Go to Login</Button>
                    </Paper>
                </Fade>
            </FullPageContainer>
        );
    }

    // ─── Sidebar nav items ──────────────────────────────────────────────────────
    const navItems = [
        { icon: <PersonIcon />, label: 'Profile', index: 0, path: '/my-account/profile' },
        { icon: <LocationOnIcon />, label: 'Address', index: 1, path: '/my-account/address' },
        { icon: <ShoppingCartIcon />, label: 'My Cart', index: -1, path: '/my-account/cart' },
        { icon: <ReceiptIcon />, label: 'Orders', index: 2, path: '/my-account/orders' },
        { icon: <AccountBalanceWalletIcon />, label: 'Transactions', index: 3, path: '/my-account/transactions' },
        { icon: <SupportAgentIcon />, label: 'Grievances', index: 4, path: '/my-account/grievances' },
        { icon: <FingerprintIcon />, label: 'KYC Verification', index: 5, path: '/my-account/kyc' },
    ];

    // ─── Main Render ────────────────────────────────────────────────────────────

    return (
        <FullPageContainer>
            <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2, md: 0 }, height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Welcome Header */}
                <Slide direction="down" in={showContent} timeout={800}>
                    <AnimatedPaper sx={{
                        p: { xs: 3, sm: 5 }, mb: 4,
                        background: 'linear-gradient(135deg, #C8A96A 0%, #1a8c3a 50%, #065a22 100%)',
                        color: 'white', borderRadius: { xs: '0px', sm: '28px' },
                        position: 'relative', overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(200, 169, 106, 0.25)',
                        display: defaultTab !== undefined ? 'none' : 'block',
                        '&::before': { content: '""', position: 'absolute', top: '-20%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(247,147,30,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'pulse 8s infinite alternate' },
                        '@keyframes pulse': { '0%': { transform: 'scale(1) translate(0,0)' }, '100%': { transform: 'scale(1.2) translate(20px,20px)' } }
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={profileImage || undefined} sx={{ bgcolor: '#C8A96A', width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 }, fontSize: 28, fontWeight: 800, border: '4px solid rgba(255,255,255,0.4)', '&:hover': { transform: 'scale(1.1) rotate(5deg)' }, transition: 'transform 0.3s' }}>
                                    {!profileImage && (userData.userName || 'U')[0].toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>Welcome, {getDisplayName()}!</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 3 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EmailIcon fontSize="small" /><Typography variant="body2">{formatValue(userData.email)}</Typography></Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PhoneIcon fontSize="small" /><Typography variant="body2">{formatValue(userData.mobile)}</Typography></Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}
                                sx={{ borderColor: 'white', color: 'white', width: { xs: '100%', sm: 'auto' }, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                Logout
                            </Button>
                        </Box>
                    </AnimatedPaper>
                </Slide>

                {/* Mobile Menu Toggle */}
                {isMobile && defaultTab === undefined && (
                    <Box sx={{ display: 'flex', mb: 1, px: 1 }}>
                        <Button variant="contained" startIcon={<MenuIcon />} onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                            sx={{ bgcolor: '#C8A96A', borderRadius: '12px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#C8A96A' } }}>
                            Menu
                        </Button>
                    </Box>
                )}

                {/* Mobile Dropdown Menu */}
                <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={() => setMenuAnchorEl(null)}
                    PaperProps={{ sx: { width: 220, mt: 1.5, borderRadius: '18px', background: 'rgba(10, 122, 47, 0.9)', backdropFilter: 'blur(12px)', color: 'white', '& .MuiList-root': { p: 1.5 } } }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                    {navItems.map((item) => (
                        <MenuItem key={item.index} onClick={() => { navigate(item.path); setMenuAnchorEl(null); }}
                            sx={{ borderRadius: '8px', py: 1, mb: 0.5, bgcolor: tabValue === item.index ? 'rgba(255,255,255,0.2)' : 'transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
                                {React.cloneElement(item.icon, { sx: { fontSize: 18, color: tabValue === item.index ? '#F7931E' : 'rgba(255,255,255,0.8)' } })}
                            </ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ sx: { fontWeight: tabValue === item.index ? 700 : 500, fontSize: '13px' } }} />
                        </MenuItem>
                    ))}
                </Menu>

                {/* Sidebar + Content */}
                <Fade in={showContent} timeout={800}>
                    <AnimatedPaper sx={{ borderRadius: defaultTab !== undefined ? '0px' : '16px', overflow: 'hidden', display: 'flex', flex: 1, minHeight: 0, boxShadow: defaultTab !== undefined ? 'none' : undefined, border: defaultTab !== undefined ? 'none' : undefined, bgcolor: defaultTab !== undefined ? 'transparent' : undefined }}>
                        {/* Left Sidebar */}
                        <Box sx={{ width: { xs: 0, sm: '220px' }, display: defaultTab !== undefined ? 'none' : { xs: 'none', sm: 'flex' }, flexShrink: 0, background: 'linear-gradient(180deg, #C8A96A 0%, #1a8c3a 60%, #C8A96A 100%)', flexDirection: 'column', py: 3, overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' } }}>
                            {navItems.map((item) => (
                                <Box key={item.index} onClick={() => navigate(item.path)} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 1.5 }, justifyContent: { xs: 'center', sm: 'flex-start' }, px: { xs: 0, sm: 2.5 }, py: 1.75, mx: 1.5, mb: 0.5, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease', bgcolor: tabValue === item.index ? 'rgba(255,255,255,0.2)' : 'transparent', borderLeft: tabValue === item.index ? '3px solid #F7931E' : '3px solid transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                                    <Box sx={{ color: tabValue === item.index ? '#F7931E' : 'rgba(255,255,255,0.8)', display: 'flex' }}>
                                        {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                                    </Box>
                                    <Typography sx={{ display: { xs: 'none', sm: 'block' }, color: tabValue === item.index ? 'white' : 'rgba(255,255,255,0.75)', fontWeight: tabValue === item.index ? 700 : 500, fontSize: '14px' }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Right Content Panel */}
                        <Box sx={{ flex: 1, p: defaultTab !== undefined ? { xs: 0, sm: 1, md: 2 } : { xs: 1.5, sm: 2, md: 3 }, overflowY: 'auto', bgcolor: defaultTab !== undefined ? 'transparent' : '#fafafa', height: '100%', position: 'relative' }}>

                            {/* ── Cart ── */}
                            {tabValue === -1 && <Box><CartPage /></Box>}

                            {/* ── Profile ── */}
                            {tabValue === 0 && (
                                <Box>
                                    <Box sx={{ mb: 3, borderRadius: '18px', overflow: 'hidden', border: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '', boxShadow: '0 4px 20px rgba(200, 169, 106, 0.1)' }}>
                                        <Box sx={{ height: '6px', background: 'linear-gradient(90deg, #C8A96A, #F7931E, #C8A96A)' }} />
                                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, bgcolor: '#1A1A1A', flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                                    <Avatar src={profileImage || undefined} sx={{ width: 80, height: 80, bgcolor: '#C8A96A', fontSize: 32, fontWeight: 700, border: '3px solid ' + 'rgba(200, 169, 106, 0.15)' + '' }}>
                                                        {!profileImage && (userData.userName || 'U')[0].toUpperCase()}
                                                    </Avatar>
                                                    {editMode && (
                                                        <Tooltip title="Upload photo">
                                                            <Box component="label" htmlFor="profile-image-upload" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#C8A96A', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white', '&:hover': { bgcolor: 'rgba(200,169,106,0.8)' } }}>
                                                                <CameraAltIcon sx={{ color: 'white', fontSize: 13 }} />
                                                            </Box>
                                                        </Tooltip>
                                                    )}
                                                    <input id="profile-image-upload" type="file" accept="image/*" hidden disabled={!editMode} onChange={handleImageUpload} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 800, fontSize: '20px', color: '#F5E6C8', lineHeight: 1.2 }}>{formatValue(userData.userName)}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                                                        <Box sx={{ bgcolor: 'rgba(200, 169, 106, 0.1)', color: '#C8A96A', fontWeight: 600, fontSize: '11px', px: 1.5, py: 0.25, borderRadius: '20px' }}>ID: {formatValue(userData.memberId)}</Box>
                                                        <Box sx={{ bgcolor: '#0D0D0D', color: '#C8A96A', fontWeight: 600, fontSize: '11px', px: 1.5, py: 0.25, borderRadius: '20px' }}>{formatValue(userData.position)}</Box>
                                                    </Box>
                                                    <Typography sx={{ color: 'rgba(200, 169, 106, 0.8)', fontSize: '13px', mt: 0.5 }}>{formatValue(userData.email)}</Typography>
                                                </Box>
                                            </Box>
                                            {!editMode ? (
                                                <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditStart} size="small" sx={{ borderColor: '#C8A96A', color: '#C8A96A', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: 'rgba(200, 169, 106, 0.1)' }, ml: { xs: 0, sm: 'auto' } }}>Edit Profile</Button>
                                            ) : (
                                                <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, sm: 'auto' } }}>
                                                    <Button variant="contained" startIcon={saving ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SaveIcon />} onClick={handleSaveProfile} disabled={saving} size="small" sx={{ bgcolor: '#C8A96A', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: 'rgba(200,169,106,0.8)' } }}>Save</Button>
                                                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleEditCancel} size="small" sx={{ borderColor: 'rgba(200, 169, 106, 0.2)', color: 'rgba(200, 169, 106, 0.8)', borderRadius: '8px', fontWeight: 600 }}>Cancel</Button>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Personal Info */}
                                    <Paper variant="outlined" sx={{ borderRadius: '18px', overflow: 'hidden', mb: 3 }}>
                                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '', bgcolor: '#0D0D0D' }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#F5E6C8' }}>Personal Information</Typography>
                                        </Box>
                                        <Box sx={{ px: 3, py: 1.5 }}>
                                            {editMode ? (
                                                <Grid container spacing={1.5} sx={{ py: 1.5 }}>
                                                    {[
                                                        { label: 'User Name', key: 'userName' },
                                                        { label: "Father's Name", key: 'fatherName' },
                                                        { label: 'Phone', key: 'mobile' },
                                                        { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                                                        { label: 'Date of Birth', key: 'dob', type: 'date' },
                                                        { label: 'Qualification', key: 'qualification' },
                                                        { label: 'Shipping Address', key: 'shippingAddress' }
                                                    ].map((field) => (
                                                        <Grid item xs={12} key={field.key}>
                                                            {field.type === 'select' ? (
                                                                <TextField select fullWidth size="small" label={field.label} value={editData[field.key] || ''} onChange={(e) => setEditData(p => ({ ...p, [field.key]: e.target.value }))} SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
                                                                    <option value=""></option>
                                                                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                                                                </TextField>
                                                            ) : field.type === 'date' ? (
                                                                <TextField
                                                                    fullWidth
                                                                    size="small"
                                                                    label={field.label}
                                                                    type="date"
                                                                    value={editData[field.key] || ''}
                                                                    onChange={(e) => setEditData(p => ({ ...p, [field.key]: e.target.value }))}
                                                                    InputLabelProps={{ shrink: true }}
                                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                                                />
                                                            ) : (
                                                                <TextField fullWidth size="small" label={field.label} value={editData[field.key] || ''} onChange={(e) => setEditData(p => ({ ...p, [field.key]: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                                            )}
                                                        </Grid>
                                                    ))}
                                                    <Grid item xs={12}><TextField fullWidth size="small" label="Email Address" value={formatValue(userData.email)} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#1A1A1A' } }} /></Grid>
                                                    <Grid item xs={12}><TextField fullWidth size="small" label="Position" value={formatValue(userData.position)} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#1A1A1A' } }} /></Grid>
                                                </Grid>
                                            ) : (
                                                <Grid container spacing={4} sx={{ py: 3, px: 1 }}>
                                                    {[
                                                        { label: 'Full User Name', value: formatValue(userData.userName), icon: <PersonIcon /> },
                                                        { label: "Father's Name", value: formatValue(userData.fatherName), icon: <GroupsIcon /> },
                                                        { label: 'Official Email Address', value: formatValue(userData.email), icon: <EmailIcon /> },
                                                        { label: 'Contact Phone Number', value: formatValue(userData.mobile), icon: <PhoneIcon /> },
                                                        { label: 'Gender', value: formatValue(userData.gender), icon: <WcIcon /> },
                                                        { label: 'Date of Birth', value: formatDateValue(userData.dob), icon: <EventIcon /> },
                                                        { label: 'Qualification', value: formatValue(userData.qualification), icon: <BadgeIcon /> },
                                                        { label: 'Position / Designation', value: formatValue(userData.position), icon: <BadgeIcon /> },
                                                        { label: 'Shipping Address', value: formatValue(userData.shippingAddress), icon: <HomeIcon /> },
                                                    ].map((field, fi) => (
                                                        <Grid item xs={12} sm={6} key={fi}>
                                                            <Box sx={{ mb: 1 }}>
                                                                <Typography sx={{ color: '#C8A96A', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', mb: 1.2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    {React.cloneElement(field.icon, { sx: { fontSize: 16, color: '#C8A96A' } })} {field.label}
                                                                </Typography>
                                                                <Box sx={{
                                                                    px: 2.5,
                                                                    py: 1.8,
                                                                    bgcolor: '#0D0D0D',
                                                                    border: '1.5px solid ' + 'rgba(200, 169, 106, 0.15)' + '',
                                                                    borderRadius: '12px',
                                                                    transition: 'all 0.2s ease-in-out',
                                                                    '&:hover': {
                                                                        bgcolor: '#1A1A1A',
                                                                        borderColor: '#C8A96A',
                                                                        boxShadow: '0 4px 12px rgba(200, 169, 106, 0.06)'
                                                                    }
                                                                }}>
                                                                    <Typography sx={{ color: '#F5E6C8', fontSize: '14px', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{field.value}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            )}
                                        </Box>
                                    </Paper>

                                    {/* KYC in Profile */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#C8A96A', mb: 2, fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FingerprintIcon sx={{ fontSize: 22 }} /> KYC Verification
                                        </Typography>
                                        {renderKycForm()}
                                    </Box>
                                </Box>
                            )}

                            {/* ── Address ── */}
                            {tabValue === 1 && (
                                <Box>
                                    <Box sx={{ mb: 3, borderRadius: '18px', overflow: 'hidden', border: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '', boxShadow: '0 4px 20px rgba(200, 169, 106, 0.1)' }}>
                                        <Box sx={{ height: '6px', background: 'linear-gradient(90deg, #C8A96A, #F7931E, #C8A96A)' }} />
                                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: '12px', bgcolor: 'rgba(200, 169, 106, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <LocationOnIcon sx={{ color: '#C8A96A', fontSize: { xs: 20, sm: 26 } }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: { xs: '14px', sm: '16px' }, color: '#F5E6C8' }}>Address Information</Typography>
                                                <Typography sx={{ color: 'rgba(200, 169, 106, 0.8)', fontSize: { xs: '11px', sm: '13px' }, mt: 0.25 }}>
                                                    {[userData.village, userData.district, userData.state].filter(Boolean).join(', ') || 'No address on file'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Paper variant="outlined" sx={{ borderRadius: '18px', overflow: 'hidden', mb: 3 }}>
                                        <Box sx={{ px: 3, py: 2, bgcolor: '#0D0D0D', borderBottom: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '' }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#F5E6C8', display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <HomeIcon sx={{ fontSize: 22, color: '#C8A96A' }} /> Location Details
                                            </Typography>
                                        </Box>
                                        <Box sx={{ px: 3, py: 1.5 }}>
                                            <Grid container spacing={2.5} sx={{ py: 2 }}>
                                                {[
                                                    { label: 'State', value: formatValue(userData.state), icon: <FlagIcon sx={{ fontSize: 18, color: '#C8A96A' }} /> },
                                                    { label: 'District', value: formatValue(userData.district), icon: <LocationOnIcon sx={{ fontSize: 18, color: '#C8A96A' }} /> },
                                                    { label: 'Assembly Area', value: formatValue(userData.assemblyArea), icon: <GroupsIcon sx={{ fontSize: 18, color: '#C8A96A' }} /> },
                                                    { label: 'Block', value: formatValue(userData.block), icon: <VillaIcon sx={{ fontSize: 18, color: '#C8A96A' }} /> },
                                                    { label: 'Village Council', value: formatValue(userData.villageCouncil), icon: <AccountCircleIcon sx={{ fontSize: 18, color: '#C8A96A' }} /> },
                                                    { label: 'Village', value: formatValue(userData.village), icon: <AgricultureIcon sx={{ fontSize: 18, color: '#C8A96A' }} /> },
                                                ].map((field, fi) => (
                                                    <Grid item xs={12} key={fi}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: '12px', bgcolor: '#0D0D0D', border: '1px solid rgba(10,122,47,0.08)', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(200, 169, 106, 0.08)', bgcolor: '#1A1A1A' } }}>
                                                            <Box sx={{ bgcolor: 'rgba(200, 169, 106, 0.05)', p: 1, borderRadius: '8px', display: 'flex' }}>{field.icon}</Box>
                                                            <Box>
                                                                <Typography sx={{ color: 'rgba(200, 169, 106, 0.8)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>{field.label}</Typography>
                                                                <Typography sx={{ color: '#F5E6C8', fontSize: '14px', fontWeight: 700 }}>{field.value}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Paper>

                                    <Paper variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                                        <Box sx={{ px: 2, py: 1.5, bgcolor: '#0D0D0D', borderBottom: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '' }}>
                                            <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#F5E6C8', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 20, color: '#C8A96A' }} /> Shipping Address
                                            </Typography>
                                        </Box>
                                        <Box sx={{ px: 2, py: 1.5, bgcolor: '#1A1A1A' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Box sx={{ bgcolor: 'rgba(200, 169, 106, 0.05)', p: 1.5, borderRadius: '10px', display: 'flex' }}><HomeIcon sx={{ color: '#C8A96A' }} /></Box>
                                                <Box>
                                                    <Typography sx={{ color: 'rgba(200, 169, 106, 0.8)', fontSize: '12px', fontWeight: 500, mb: 0.75 }}>Full Address</Typography>
                                                    <Typography sx={{ color: '#F5E6C8', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 700, lineHeight: 1.6 }}>
                                                        {[userData.shippingAddress, userData.village, userData.villageCouncil, userData.block, userData.district, userData.state].filter(Boolean).join(', ') || 'Address not provided'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Box>
                            )}

                            {/* ── Orders ── */}
                            {tabValue === 2 && (
                                <Box sx={{ bgcolor: '#1A1A1A', borderRadius: { xs: '0', sm: '12px' }, p: { xs: 2, sm: 3 }, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)', overflow: 'hidden', width: '100%' }}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#F5E6C8', fontSize: { xs: '22px', sm: '28px' } }}>Orders</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: 'stretch', width: { xs: '100%', sm: 'auto' } }}>
                                            <TextField size="small" placeholder="Search order, invoice, email" value={orderSearchQuery} onChange={(e) => setOrderSearchQuery(e.target.value)}
                                                sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(200, 169, 106, 0.4)', fontSize: 20 }} /></InputAdornment> }} />
                                            <Button variant="contained" onClick={() => navigate('/products')} sx={{ bgcolor: '#C8A96A', '&:hover': { bgcolor: '#C8A96A' }, borderRadius: '6px', textTransform: 'none', px: 2.5, py: 1, whiteSpace: 'nowrap', fontWeight: 600, boxShadow: 'none', width: { xs: '100%', sm: 'auto' } }}>New Order</Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ borderBottom: 1, borderColor: 'rgba(200, 169, 106, 0.2)', mb: 4 }}>
                                        <Tabs value={orderTab} onChange={(e, v) => setOrderTab(v)} variant="scrollable" scrollButtons="auto"
                                            sx={{ minHeight: '44px', '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '14px', minWidth: 'auto', px: 3, py: 1, minHeight: '44px', color: 'rgba(200, 169, 106, 0.8)' }, '& .Mui-selected': { color: '#C8A96A !important' }, '& .MuiTabs-indicator': { backgroundColor: '#C8A96A', height: 3, borderRadius: '3px 3px 0 0' } }}>
                                            <Tab label="Active" value="Active" />
                                            <Tab label="All Orders" value="All Orders" />
                                            <Tab label="To Invoice" value="To Invoice" />
                                            <Tab label="To Ship" value="To Ship" />
                                            <Tab label="To Backorder" value="To Backorder" />
                                        </Tabs>
                                    </Box>

                                    {ordersLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={40} sx={{ color: '#C8A96A' }} /></Box>
                                    ) : (
                                        <Box>
                                            {userOrders.length === 0 && (
                                                <Paper variant="outlined" sx={{ borderRadius: '12px', p: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                                    <Box>
                                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#F5E6C8', mb: 1 }}>Create your first order</Typography>
                                                        <Typography variant="body2" sx={{ color: 'rgba(200, 169, 106, 0.8)', maxWidth: '600px', lineHeight: 1.6 }}>Sanyukt Parivaar aggregates orders from all of your different sales channels here.</Typography>
                                                    </Box>
                                                    <Button variant="outlined" onClick={() => navigate('/products')} sx={{ borderRadius: '6px', textTransform: 'none', borderColor: 'rgba(200, 169, 106, 0.2)', color: '#C8A96A', fontWeight: 600 }}>Create a New Sales order</Button>
                                                </Paper>
                                            )}

                                            {userOrders.length > 0 && (() => {
                                                const filteredOrders = userOrders.filter(order => {
                                                    const q = orderSearchQuery.toLowerCase();
                                                    const orderId = order._id?.slice(-8) || '';
                                                    const prodName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || '';
                                                    const matchesSearch = orderId.toLowerCase().includes(q) || prodName.toLowerCase().includes(q);
                                                    let matchesTab = true;
                                                    const status = (order.status || 'pending').toLowerCase();
                                                    if (orderTab === 'Active') matchesTab = ['pending', 'processing'].includes(status);
                                                    if (orderTab === 'To Invoice') matchesTab = ['processing', 'shipped'].includes(status);
                                                    if (orderTab === 'To Ship') matchesTab = ['processing'].includes(status);
                                                    if (orderTab === 'To Backorder') matchesTab = status === 'backorder';
                                                    return matchesSearch && matchesTab;
                                                });

                                                const getOrderStyle = (status) => {
                                                    const s = status?.toLowerCase() || 'pending';
                                                    if (s === 'processing') return { color: '#e3f2fd', text: '#1565c0', label: 'Processing' };
                                                    if (s === 'shipped') return { color: '#f3e5f5', text: '#7b1fa2', label: 'Shipped' };
                                                    if (s === 'delivered') return { color: '#e8f5e9', text: '#2e7d32', label: 'Delivered' };
                                                    if (s === 'cancelled') return { color: '#ffebee', text: '#c62828', label: 'Cancelled' };
                                                    return { color: '#fff3e0', text: '#e65100', label: 'Pending' };
                                                };

                                                const ORDER_LIMIT = 10;
                                                const visibleOrders = showAllOrders ? filteredOrders : filteredOrders.slice(0, ORDER_LIMIT);
                                                const hasMore = filteredOrders.length > ORDER_LIMIT;

                                                return (
                                                    <>
                                                        {/* Desktop Table */}
                                                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                                            <TableContainer sx={{ border: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '', borderRadius: '16px', overflow: 'hidden' }}>
                                                                <Table sx={{ minWidth: 800 }}>
                                                                    <TableHead sx={{ bgcolor: '#0D0D0D' }}>
                                                                        <TableRow>
                                                                            <TableCell padding="checkbox" sx={{ borderBottom: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '', py: 2 }}><Checkbox size="small" sx={{ color: 'rgba(200, 169, 106, 0.4)' }} /></TableCell>
                                                                            {['Order ID', 'Product / Item', 'Status', 'Total', 'Date', 'Action'].map(h => (
                                                                                <TableCell key={h} sx={{ color: '#F5E6C8', fontWeight: 700, fontSize: '13.5px', borderBottom: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '', py: 2 }}>{h}</TableCell>
                                                                            ))}
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {visibleOrders.map((order, index) => {
                                                                            const productName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || 'Item';
                                                                            const s = getOrderStyle(order.status);
                                                                            const total = order.totalAmount || order.total || '0';
                                                                            const date = new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                                                            const statusMatch = order.status?.toLowerCase() || 'pending';
                                                                            return (
                                                                                <TableRow key={order._id || index} hover sx={{ bgcolor: index % 2 === 0 ? '#1A1A1A' : '#0D0D0D', '&:hover': { bgcolor: 'rgba(200, 169, 106, 0.05)' } }}>
                                                                                    <TableCell padding="checkbox" sx={{ borderBottom: 'none', py: 2 }}><Checkbox size="small" sx={{ color: '#ddd' }} /></TableCell>
                                                                                    <TableCell sx={{ fontWeight: 700, color: '#F5E6C8', fontSize: '13.5px', borderBottom: 'none' }}>{order._id ? `#${order._id.slice(-8).toUpperCase()}` : `#${String(index + 1).padStart(4, '0')}`}</TableCell>
                                                                                    <TableCell sx={{ color: '#F5E6C8', fontWeight: 600, fontSize: '13.5px', borderBottom: 'none' }}>{productName}</TableCell>
                                                                                    <TableCell sx={{ borderBottom: 'none' }}><Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: '6px', bgcolor: s.color, color: s.text, fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}>{s.label}</Box></TableCell>
                                                                                    <TableCell sx={{ fontWeight: 800, color: '#C8A96A', fontSize: '14px', borderBottom: 'none' }}>₹{parseFloat(total).toFixed(2)}</TableCell>
                                                                                    <TableCell sx={{ color: 'rgba(200, 169, 106, 0.8)', fontSize: '13px', borderBottom: 'none' }}>{date}</TableCell>
                                                                                    <TableCell align="center" sx={{ borderBottom: 'none' }}>
                                                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                                                            <Button size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: '6px', borderColor: '#C8A96A', color: '#C8A96A', fontWeight: 600 }} onClick={() => navigate(`/order-details/${order._id}`)}>Details</Button>
                                                                                            {(statusMatch === 'shipped' || statusMatch === 'delivered') && (
                                                                                                <Button size="small" variant="contained" sx={{ textTransform: 'none', borderRadius: '6px', bgcolor: '#C8A96A', fontWeight: 600, boxShadow: 'none' }} onClick={() => window.open(`${API_URL}/api/orders/${order._id}/invoice`, '_blank')}>Invoice</Button>
                                                                                            )}
                                                                                        </Box>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </Box>

                                                        {/* Read More - Desktop */}
                                                        {hasMore && !showAllOrders && (
                                                            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mt: 3 }}>
                                                                <Button
                                                                    onClick={() => setShowAllOrders(true)}
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderColor: '#C8A96A',
                                                                        color: '#C8A96A',
                                                                        fontWeight: 700,
                                                                        borderRadius: '12px',
                                                                        px: 5,
                                                                        py: 1.2,
                                                                        textTransform: 'none',
                                                                        fontSize: '14px',
                                                                        '&:hover': { bgcolor: 'rgba(200, 169, 106, 0.1)', borderColor: '#C8A96A' },
                                                                    }}
                                                                >
                                                                    Read More ({filteredOrders.length - ORDER_LIMIT} more orders)
                                                                </Button>
                                                            </Box>
                                                        )}
                                                        {showAllOrders && hasMore && (
                                                            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mt: 3 }}>
                                                                <Button
                                                                    onClick={() => setShowAllOrders(false)}
                                                                    variant="text"
                                                                    sx={{ color: 'rgba(200, 169, 106, 0.6)', fontWeight: 600, textTransform: 'none', fontSize: '13px' }}
                                                                >
                                                                    Show Less
                                                                </Button>
                                                            </Box>
                                                        )}

                                                        {/* Mobile Cards */}
                                                        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                                                            {visibleOrders.map((order, index) => {
                                                                const s = getOrderStyle(order.status);
                                                                const productName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || 'Item';
                                                                const total = order.totalAmount || order.total || '0';
                                                                const statusMatch = order.status?.toLowerCase() || 'pending';
                                                                return (
                                                                    <Paper key={order._id || index} variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: '#1A1A1A' }}>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                                            <Box>
                                                                                <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#F5E6C8' }}>#{order._id?.slice(-8).toUpperCase() || index + 1}</Typography>
                                                                                <Typography sx={{ fontSize: '12px', color: 'rgba(200, 169, 106, 0.8)' }}>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Typography>
                                                                            </Box>
                                                                            <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', bgcolor: s.color, color: s.text, fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>{s.label}</Box>
                                                                        </Box>
                                                                        <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1, color: '#F5E6C8' }}>{productName}</Typography>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <Typography sx={{ fontWeight: 800, color: '#C8A96A', fontSize: '15px' }}>₹{parseFloat(total).toFixed(2)}</Typography>
                                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                                <Button size="small" variant="text" sx={{ color: '#C8A96A', fontWeight: 700, minWidth: 'auto', p: 0.5 }} onClick={() => navigate(`/order-details/${order._id}`)}>Details</Button>
                                                                                {(statusMatch === 'shipped' || statusMatch === 'delivered') && (
                                                                                    <Button size="small" variant="text" sx={{ color: '#C8A96A', fontWeight: 700, minWidth: 'auto', p: 0.5 }} onClick={() => window.open(`${API_URL}/api/orders/${order._id}/invoice`, '_blank')}>Invoice</Button>
                                                                                )}
                                                                            </Box>
                                                                        </Box>
                                                                    </Paper>
                                                                );
                                                            })}
                                                        </Box>

                                                        {/* Read More - Mobile */}
                                                        {hasMore && !showAllOrders && (
                                                            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2 }}>
                                                                <Button
                                                                    onClick={() => setShowAllOrders(true)}
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    sx={{
                                                                        borderColor: '#C8A96A',
                                                                        color: '#C8A96A',
                                                                        fontWeight: 700,
                                                                        borderRadius: '12px',
                                                                        py: 1.5,
                                                                        textTransform: 'none',
                                                                        fontSize: '14px',
                                                                        '&:hover': { bgcolor: 'rgba(200, 169, 106, 0.1)', borderColor: '#C8A96A' },
                                                                    }}
                                                                >
                                                                    Read More ({filteredOrders.length - ORDER_LIMIT} more)
                                                                </Button>
                                                            </Box>
                                                        )}
                                                        {showAllOrders && hasMore && (
                                                            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mt: 2 }}>
                                                                <Button
                                                                    onClick={() => setShowAllOrders(false)}
                                                                    variant="text"
                                                                    sx={{ color: 'rgba(200, 169, 106, 0.6)', fontWeight: 600, textTransform: 'none', fontSize: '13px' }}
                                                                >
                                                                    Show Less
                                                                </Button>
                                                            </Box>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* ══════════════════════════════════════════════ */}
                            {/* ── Transactions Tab ──                         */}
                            {/* ══════════════════════════════════════════════ */}
                            {tabValue === 3 && (() => {
                                const walletTxTotalPages = Math.ceil(filteredWalletTx.length / WALLET_TX_PER_PAGE);
                                const walletTxStartIdx = (walletTxPage - 1) * WALLET_TX_PER_PAGE;
                                const paginatedWalletTx = filteredWalletTx.slice(walletTxStartIdx, walletTxStartIdx + WALLET_TX_PER_PAGE);
                                const getWalletPages = () => {
                                    const pages = [];
                                    const max = 5;
                                    let start = Math.max(1, walletTxPage - Math.floor(max / 2));
                                    let end = Math.min(walletTxTotalPages, start + max - 1);
                                    if (end - start < max - 1) start = Math.max(1, end - max + 1);
                                    for (let i = start; i <= end; i++) pages.push(i);
                                    return pages;
                                };
                                return (
                                <Box>
                                    <Typography variant="h5" sx={{ color: '#F5E6C8', mb: 3, fontWeight: 800, borderBottom: '3px solid #C8A96A', pb: 1, display: 'inline-block', fontSize: { xs: '20px', sm: '24px' } }}>
                                        Transaction History
                                    </Typography>

                                    {/* Stats Cards */}
                                    <Grid container spacing={2} sx={{ mb: 4 }}>
                                        <Grid item xs={6} sm={3}>
                                            <Paper sx={{ p: 2.5, borderRadius: '12px', borderLeft: '4px solid #C8A96A', bgcolor: '#1A1A1A', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                                                <Typography sx={{ color: '#C8A96A', fontWeight: 700, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>Total Orders</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5, color: '#F5E6C8' }}>{userOrders.length}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper sx={{ p: 2.5, borderRadius: '12px', borderLeft: '4px solid #F7931E', bgcolor: '#1A1A1A', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                                                <Typography sx={{ color: '#C8A96A', fontWeight: 700, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>Recharges</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5, color: '#F5E6C8' }}>{userTransactions.filter(t => t.type !== 'donation').length}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper sx={{ p: 2.5, borderRadius: '12px', borderLeft: '4px solid #e91e63', bgcolor: '#1A1A1A', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                                                <Typography sx={{ color: '#C8A96A', fontWeight: 700, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>Donations</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5, color: '#F5E6C8' }}>{userTransactions.filter(t => t.type === 'donation').length}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper sx={{ p: 2.5, borderRadius: '12px', borderLeft: '4px solid #2196f3', bgcolor: '#1A1A1A', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
                                                <Typography sx={{ color: '#C8A96A', fontWeight: 700, textTransform: 'uppercase', fontSize: '13px', letterSpacing: '0.05em' }}>Tickets</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5, color: '#F5E6C8' }}>{userGrievances.length}</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* ══ WALLET TRANSACTION REPORT ══ */}
                                    <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#C8A96A', fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccountBalanceWalletIcon sx={{ fontSize: 22 }} /> Wallet Transactions
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                            {[
                                                { key: 'All', label: 'All' },
                                                { key: 'credit', label: '↑ Credits' },
                                                { key: 'debit', label: '↓ Debits' },
                                            ].map(f => (
                                                <Button key={f.key} size="small"
                                                    variant={walletTxFilter === f.key ? 'contained' : 'outlined'}
                                                    onClick={() => { setWalletTxFilter(f.key); setWalletTxPage(1); }}
                                                    sx={{
                                                        textTransform: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '13px', px: 2.5, py: 0.8,
                                                        ...(walletTxFilter === f.key
                                                            ? { bgcolor: f.key === 'debit' ? '#d32f2f' : '#C8A96A', '&:hover': { bgcolor: f.key === 'debit' ? '#b71c1c' : 'rgba(200,169,106,0.8)' } }
                                                            : { borderColor: f.key === 'debit' ? '#d32f2f' : '#C8A96A', color: f.key === 'debit' ? '#d32f2f' : '#C8A96A' })
                                                    }}>
                                                    {f.label}
                                                </Button>
                                            ))}
                                            <TextField size="small" placeholder="Search..." value={walletTxSearch} onChange={(e) => { setWalletTxSearch(e.target.value); setWalletTxPage(1); }}
                                                sx={{ width: { xs: '100%', sm: 180 }, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '14px' } }}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'rgba(200, 169, 106, 0.4)' }} /></InputAdornment> }} />
                                        </Box>
                                    </Box>

                                    {/* Wallet Transactions Content */}
                                    {walletTxLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                            <CircularProgress size={36} sx={{ color: '#C8A96A' }} />
                                        </Box>
                                    ) : walletTxError ? (
                                        <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#1A1A1A', borderRadius: '12px', border: '1px solid #ffcdd2', mb: 4 }}>
                                            <Typography sx={{ color: '#d32f2f', fontWeight: 600, fontSize: '15px', mb: 1 }}>{walletTxError}</Typography>
                                            <Button variant="outlined" size="small" onClick={fetchAllWalletTransactions} sx={{ borderColor: '#C8A96A', color: '#C8A96A', borderRadius: '10px', textTransform: 'none', fontSize: '14px' }}>Try Again</Button>
                                        </Box>
                                    ) : filteredWalletTx.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 5, bgcolor: '#1A1A1A', borderRadius: '12px', border: '1px solid rgba(200, 169, 106, 0.15)', mb: 4 }}>
                                            <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'rgba(200, 169, 106, 0.3)', mb: 1 }} />
                                            <Typography sx={{ color: '#F5E6C8', fontWeight: 600, fontSize: '16px' }}>
                                                {allWalletTransactions.length === 0 ? 'No Wallet Transactions Yet' : 'No transactions match your filter'}
                                            </Typography>
                                            <Typography sx={{ color: 'rgba(200, 169, 106, 0.5)', mt: 0.5, fontSize: '14px' }}>Income and withdrawal transactions will appear here.</Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ mb: 4 }}>
                                            {/* Desktop Table */}
                                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                                <TableContainer sx={{ border: '1px solid rgba(200, 169, 106, 0.15)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)', mb: 1 }}>
                                                    <Table>
                                                        <TableHead sx={{ bgcolor: '#0D0D0D' }}>
                                                            <TableRow>
                                                                {['#', 'Date', 'Type', 'Amount', 'Source / Description', 'Reference'].map(h => (
                                                                    <TableCell key={h} sx={{ color: '#C8A96A', fontWeight: 800, fontSize: '14px', borderBottom: '1px solid rgba(200, 169, 106, 0.15)', py: 2.5, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{h}</TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {paginatedWalletTx.map((txn, index) => (
                                                                <TableRow key={txn._id || index} hover sx={{ bgcolor: index % 2 === 0 ? '#1A1A1A' : '#0D0D0D', '&:hover': { bgcolor: 'rgba(200, 169, 106, 0.05)' } }}>
                                                                    <TableCell sx={{ borderBottom: 'none', color: '#C8A96A', fontSize: '14px', fontWeight: 600 }}>{walletTxStartIdx + index + 1}</TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none', color: '#F5E6C8', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                                        {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none' }}>
                                                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 2, py: 0.5, borderRadius: '8px', bgcolor: txn.txType === 'credit' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(230, 81, 0, 0.1)', color: txn.txType === 'credit' ? '#4caf50' : '#ff9800', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}>
                                                                            {txn.txType === 'credit' ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
                                                                            {txn.type}
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none' }}>
                                                                        <Typography sx={{ fontWeight: 900, fontSize: '16px', color: txn.txType === 'credit' ? '#4caf50' : '#ef5350' }}>
                                                                            {txn.txType === 'credit' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none', maxWidth: 220 }}>
                                                                        <Typography noWrap sx={{ fontSize: '14px', color: '#F5E6C8', fontWeight: 500 }}>{txn.source}</Typography>
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none', color: 'rgba(200, 169, 106, 0.7)', fontSize: '13px', fontWeight: 500 }}>{txn.details || '—'}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>

                                            {/* Mobile Cards */}
                                            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                                                {paginatedWalletTx.map((txn, index) => (
                                                    <Paper key={txn._id || index} variant="outlined" sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#1A1A1A', borderLeft: `4px solid ${txn.txType === 'credit' ? '#4caf50' : '#ef5350'}` }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, borderRadius: '6px', bgcolor: txn.txType === 'credit' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(230, 81, 0, 0.1)', color: txn.txType === 'credit' ? '#4caf50' : '#ff9800', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', mb: 1 }}>
                                                                    {txn.txType === 'credit' ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
                                                                    {txn.type}
                                                                </Box>
                                                                <Typography sx={{ fontSize: '15px', color: '#F5E6C8', fontWeight: 600 }}>{txn.source}</Typography>
                                                                <Typography sx={{ fontSize: '13px', color: 'rgba(200, 169, 106, 0.6)', mt: 0.5 }}>
                                                                    {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </Typography>
                                                            </Box>
                                                            <Typography sx={{ fontWeight: 900, fontSize: '18px', color: txn.txType === 'credit' ? '#4caf50' : '#ef5350', flexShrink: 0 }}>
                                                                {txn.txType === 'credit' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                    </Paper>
                                                ))}
                                            </Box>

                                            {/* Pagination */}
                                            {walletTxTotalPages > 1 && (
                                                <Box sx={{ mt: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                                    <Typography sx={{ color: 'rgba(200, 169, 106, 0.6)', fontSize: '14px', fontWeight: 500 }}>
                                                        Showing {walletTxStartIdx + 1} – {Math.min(walletTxStartIdx + WALLET_TX_PER_PAGE, filteredWalletTx.length)} of {filteredWalletTx.length}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                                                        <Button size="small" disabled={walletTxPage === 1} onClick={() => setWalletTxPage(p => p - 1)}
                                                            sx={{ minWidth: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(200, 169, 106, 0.15)', color: '#C8A96A', '&.Mui-disabled': { color: 'rgba(200, 169, 106, 0.15)', borderColor: 'rgba(200, 169, 106, 0.05)' } }}>‹</Button>
                                                        {getWalletPages()[0] > 1 && (
                                                            <>
                                                                <Button size="small" onClick={() => setWalletTxPage(1)} sx={{ minWidth: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(200, 169, 106, 0.1)', color: '#C8A96A', fontSize: '14px', fontWeight: 700 }}>1</Button>
                                                                {getWalletPages()[0] > 2 && <Typography sx={{ color: 'rgba(200, 169, 106, 0.3)', px: 0.5 }}>…</Typography>}
                                                            </>
                                                        )}
                                                        {getWalletPages().map(pg => (
                                                            <Button key={pg} size="small" onClick={() => setWalletTxPage(pg)}
                                                                sx={{ minWidth: 36, height: 36, borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                                                                    ...(pg === walletTxPage
                                                                        ? { bgcolor: '#C8A96A', color: '#0D0D0D', '&:hover': { bgcolor: '#C8A96A' } }
                                                                        : { border: '1px solid rgba(200, 169, 106, 0.1)', color: '#C8A96A' })
                                                                }}>{pg}</Button>
                                                        ))}
                                                        {getWalletPages()[getWalletPages().length - 1] < walletTxTotalPages && (
                                                            <>
                                                                {getWalletPages()[getWalletPages().length - 1] < walletTxTotalPages - 1 && <Typography sx={{ color: 'rgba(200, 169, 106, 0.3)', px: 0.5 }}>…</Typography>}
                                                                <Button size="small" onClick={() => setWalletTxPage(walletTxTotalPages)} sx={{ minWidth: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(200, 169, 106, 0.1)', color: '#C8A96A', fontSize: '14px', fontWeight: 700 }}>{walletTxTotalPages}</Button>
                                                            </>
                                                        )}
                                                        <Button size="small" disabled={walletTxPage === walletTxTotalPages} onClick={() => setWalletTxPage(p => p + 1)}
                                                            sx={{ minWidth: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(200, 169, 106, 0.15)', color: '#C8A96A', '&.Mui-disabled': { color: 'rgba(200, 169, 106, 0.15)', borderColor: 'rgba(200, 169, 106, 0.05)' } }}>›</Button>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 3 }} />

                                    {/* ══ ORDER HISTORY ══ */}
                                    <Typography variant="h6" sx={{ color: '#C8A96A', mb: 2, fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        🛒 Order History
                                    </Typography>
                                    {ordersLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={36} sx={{ color: '#C8A96A' }} /></Box>
                                    ) : userOrders.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#1A1A1A', borderRadius: '12px', border: '1px solid rgba(200, 169, 106, 0.15)', mb: 4 }}>
                                            <ShoppingBagIcon sx={{ fontSize: 60, color: 'rgba(200, 169, 106, 0.3)', mb: 1 }} />
                                            <Typography sx={{ color: '#F5E6C8', fontWeight: 600, fontSize: '16px' }}>No Orders Yet</Typography>
                                        </Box>
                                    ) : (() => {
                                        const orderHistTotalPages = Math.ceil(userOrders.length / WALLET_TX_PER_PAGE);
                                        const orderHistStartIdx = (orderHistPage - 1) * WALLET_TX_PER_PAGE;
                                        const paginatedOrders = userOrders.slice(orderHistStartIdx, orderHistStartIdx + WALLET_TX_PER_PAGE);
                                        return (
                                        <Box sx={{ mb: 4 }}>
                                            {paginatedOrders.map((order, index) => {
                                                const productName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || 'Item';
                                                const total = order.totalAmount || order.total || '0';
                                                return (
                                                    <Paper key={order._id || index} variant="outlined" sx={{ p: 0, borderRadius: '14px', mb: 2, overflow: 'hidden', cursor: 'pointer', '&:hover': { boxShadow: '0 6px 18px rgba(200, 169, 106, 0.08)', borderColor: '#C8A96A' }, transition: 'all 0.3s ease' }} onClick={() => setTabValue(2)}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ p: 2, bgcolor: 'rgba(200, 169, 106, 0.05)', borderRight: '1px solid rgba(200, 169, 106, 0.15)', display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <ShoppingBagIcon sx={{ color: '#C8A96A', fontSize: 24 }} />
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ p: 2, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Box>
                                                                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#F5E6C8' }}>Order #{order._id?.slice(-8).toUpperCase() || index + 1}</Typography>
                                                                    <Typography sx={{ fontSize: '13px', color: 'rgba(200, 169, 106, 0.6)' }}>{productName} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                                                                </Box>
                                                                <Box sx={{ textAlign: 'right' }}>
                                                                    <Typography sx={{ fontWeight: 800, color: '#C8A96A', fontSize: '16px' }}>₹{total}</Typography>
                                                                    <Chip label={(order.status || 'Placed').toUpperCase()} size="small" sx={{ height: 22, fontSize: '11px', fontWeight: 800, mt: 0.5, bgcolor: order.status === 'delivered' ? '#4caf50' : order.status === 'pending' ? '#ff9800' : '#C8A96A', color: 'white', borderRadius: '6px' }} />
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                );
                                            })}
                                            {orderHistTotalPages > 1 && (
                                                <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                                    <Typography sx={{ color: 'rgba(200, 169, 106, 0.6)', fontSize: '14px', fontWeight: 500 }}>
                                                        Showing {orderHistStartIdx + 1} – {Math.min(orderHistStartIdx + WALLET_TX_PER_PAGE, userOrders.length)} of {userOrders.length}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                                                        <Button size="small" disabled={orderHistPage === 1} onClick={() => setOrderHistPage(p => p - 1)}
                                                            sx={{ minWidth: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(200, 169, 106, 0.15)', color: '#C8A96A', '&.Mui-disabled': { color: 'rgba(200, 169, 106, 0.15)', borderColor: 'rgba(200, 169, 106, 0.05)' } }}>‹</Button>
                                                        {Array.from({ length: orderHistTotalPages }, (_, i) => i + 1).map(pg => (
                                                            <Button key={pg} size="small" onClick={() => setOrderHistPage(pg)}
                                                                sx={{ minWidth: 36, height: 36, borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                                                                    ...(pg === orderHistPage
                                                                        ? { bgcolor: '#C8A96A', color: '#0D0D0D', '&:hover': { bgcolor: '#C8A96A' } }
                                                                        : { border: '1px solid rgba(200, 169, 106, 0.1)', color: '#C8A96A' })
                                                                }}>{pg}</Button>
                                                        ))}
                                                        <Button size="small" disabled={orderHistPage === orderHistTotalPages} onClick={() => setOrderHistPage(p => p + 1)}
                                                            sx={{ minWidth: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(200, 169, 106, 0.15)', color: '#C8A96A', '&.Mui-disabled': { color: 'rgba(200, 169, 106, 0.15)', borderColor: 'rgba(200, 169, 106, 0.05)' } }}>›</Button>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                        );
                                    })()}

                                    {/* ── RECHARGE HISTORY SECTION ── */}
                                    {userTransactions.some(t => t.type !== 'donation') && (() => {
                                        const rechargeData = userTransactions.filter(txn => txn.type !== 'donation');
                                        const rechargeTotalPages = Math.ceil(rechargeData.length / WALLET_TX_PER_PAGE);
                                        const rechargeStartIdx = (rechargeHistPage - 1) * WALLET_TX_PER_PAGE;
                                        const paginatedRecharges = rechargeData.slice(rechargeStartIdx, rechargeStartIdx + WALLET_TX_PER_PAGE);
                                        return (
                                        <>
                                            <Typography variant="h6" sx={{ color: '#C8A96A', mb: 2, fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                ⚡ Recharge History
                                            </Typography>
                                            <Box sx={{ mb: 4 }}>
                                                {paginatedRecharges.map((txn, index) => (
                                                    <Paper
                                                        key={txn._id || index}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 0,
                                                            borderRadius: '14px',
                                                            mb: 2,
                                                            overflow: 'hidden',
                                                            '&:hover': { boxShadow: '0 6px 18px rgba(0, 0, 0, 0.4)' },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
                                                            <Box sx={{
                                                                p: 2,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                bgcolor: txn.status === 'success' ? 'rgba(76, 175, 80, 0.05)' : txn.status === 'failed' ? 'rgba(211, 47, 47, 0.05)' : 'rgba(251, 192, 45, 0.05)',
                                                                borderRight: { xs: 'none', sm: '1px solid rgba(200, 169, 106, 0.1)' },
                                                                borderBottom: { xs: '1px solid rgba(200, 169, 106, 0.1)', sm: 'none' },
                                                                justifyContent: { xs: 'center', sm: 'flex-start' }
                                                            }}>
                                                                <Box sx={{
                                                                    width: 44, height: 44, borderRadius: '10px', bgcolor: '#1A1A1A',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
                                                                }}>
                                                                    <ReceiptIcon sx={{
                                                                        fontSize: 24,
                                                                        color: txn.status === 'success' ? '#C8A96A' : txn.status === 'failed' ? '#d32f2f' : '#fbc02d'
                                                                    }} />
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ p: 2, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Box>
                                                                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#F5E6C8', mb: 0.25 }}>
                                                                        {txn.operator} {txn.type?.toUpperCase()}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                        <Typography sx={{ fontSize: '13px', color: 'rgba(200, 169, 106, 0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <PhoneIcon sx={{ fontSize: 13 }} /> {txn.rechargeNumber}
                                                                        </Typography>
                                                                        <Typography sx={{ fontSize: '13px', color: 'rgba(200, 169, 106, 0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <EventIcon sx={{ fontSize: 13 }} /> {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                                <Box sx={{ textAlign: 'right' }}>
                                                                    <Typography sx={{ fontWeight: 800, color: '#F5E6C8', fontSize: '16px' }}>₹{txn.amount}</Typography>
                                                                    <Chip
                                                                        label={txn.status?.toUpperCase()}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 22, fontSize: '11px', fontWeight: 800, mt: 0.75, px: 0.5,
                                                                            bgcolor: txn.status === 'success' ? '#4caf50' : txn.status === 'failed' ? '#d32f2f' : '#ff9800',
                                                                            color: 'white',
                                                                            borderRadius: '6px'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                ))}
                                                {rechargeTotalPages > 1 && (
                                                    <Box sx={{ mt: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                                        <Typography sx={{ color: 'rgba(200, 169, 106, 0.6)', fontSize: '14px', fontWeight: 500 }}>
                                                            Showing {rechargeStartIdx + 1} – {Math.min(rechargeStartIdx + WALLET_TX_PER_PAGE, rechargeData.length)} of {rechargeData.length}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                                                            <Button size="small" disabled={rechargeHistPage === 1} onClick={() => setRechargeHistPage(p => p - 1)}
                                                                sx={{ minWidth: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(200, 169, 106, 0.15)', color: '#C8A96A', '&.Mui-disabled': { color: 'rgba(200, 169, 106, 0.15)', borderColor: 'rgba(200, 169, 106, 0.05)' } }}>‹</Button>
                                                            {Array.from({ length: rechargeTotalPages }, (_, i) => i + 1).map(pg => (
                                                                <Button key={pg} size="small" onClick={() => setRechargeHistPage(pg)}
                                                                    sx={{ minWidth: 36, height: 36, borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                                                                        ...(pg === rechargeHistPage
                                                                            ? { bgcolor: '#C8A96A', color: '#0D0D0D', '&:hover': { bgcolor: '#C8A96A' } }
                                                                            : { border: '1px solid rgba(200, 169, 106, 0.1)', color: '#C8A96A' })
                                                                    }}>{pg}</Button>
                                                            ))}
                                                            <Button size="small" disabled={rechargeHistPage === rechargeTotalPages} onClick={() => setRechargeHistPage(p => p + 1)}
                                                                sx={{ minWidth: 36, height: 36, borderRadius: '10px', border: '1px solid rgba(200, 169, 106, 0.15)', color: '#C8A96A', '&.Mui-disabled': { color: 'rgba(200, 169, 106, 0.15)', borderColor: 'rgba(200, 169, 106, 0.05)' } }}>›</Button>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        </>
                                        );
                                    })()}

                                    {/* ── DONATION HISTORY SECTION ── */}
                                    {userTransactions.some(t => t.type === 'donation') && (
                                        <>
                                            <Typography variant="h6" sx={{ color: '#C8A96A', mb: 2, fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                🤝 Donation History
                                            </Typography>
                                            <Box sx={{ mb: 4 }}>
                                                {userTransactions.filter(txn => txn.type === 'donation').map((txn, index) => (
                                                    <Paper
                                                        key={txn._id || index}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 0,
                                                            borderRadius: '14px',
                                                            mb: 2,
                                                            overflow: 'hidden',
                                                            '&:hover': { boxShadow: '0 6px 18px rgba(233,30,99,0.06)', borderColor: '#C8A96A' },
                                                            transition: 'all 0.3s ease',
                                                            borderLeft: '4px solid #e91e63'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
                                                            <Box sx={{
                                                                p: 2,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                bgcolor: 'rgba(200, 169, 106, 0.05)',
                                                                borderRight: { xs: 'none', sm: '1px solid #f0f0f0' },
                                                                borderBottom: { xs: '1px solid #f0f0f0', sm: 'none' },
                                                                justifyContent: { xs: 'center', sm: 'flex-start' }
                                                            }}>
                                                                <Box sx={{
                                                                    width: 44, height: 44, borderRadius: '10px', bgcolor: '#1A1A1A',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)'
                                                                }}>
                                                                    <ShareIcon sx={{ color: '#C8A96A', fontSize: 24 }} />
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ p: 2, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Box>
                                                                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#F5E6C8', mb: 0.25 }}>
                                                                        Contribution to Sanyukt Parivaar
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                        <Typography sx={{ fontSize: '12px', color: 'rgba(200, 169, 106, 0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <ShieldIcon sx={{ width: 12, height: 12 }} /> {txn.paymentMethod?.toUpperCase()}
                                                                        </Typography>
                                                                        <Typography sx={{ fontSize: '12px', color: 'rgba(200, 169, 106, 0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <EventIcon sx={{ fontSize: 12 }} /> {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                                <Box sx={{ textAlign: 'right' }}>
                                                                    <Typography sx={{ fontWeight: 800, color: '#C8A96A', fontSize: '16px' }}>₹{txn.amount}</Typography>
                                                                    <Chip
                                                                        label={txn.status?.toUpperCase()}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 20, fontSize: '10px', fontWeight: 800, mt: 0.75, px: 0.5,
                                                                            bgcolor: txn.status === 'success' ? '#C8A96A' : '#757575',
                                                                            color: 'white',
                                                                            borderRadius: '4px'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        </>
                                    )}

                                    {userTransactions.length === 0 && (
                                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#1A1A1A', borderRadius: '12px', border: '1px solid ' + 'rgba(200, 169, 106, 0.15)' + '' }}>
                                            <ReceiptIcon sx={{ fontSize: 60, color: '#eee', mb: 1 }} />
                                            <Typography sx={{ color: 'rgba(200, 169, 106, 0.8)', fontWeight: 600 }}>No Payments Yet</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(200, 169, 106, 0.4)', mt: 0.5 }}>Your recharges and donations will appear here.</Typography>
                                            <Button variant="outlined" size="small" sx={{ mt: 2, borderColor: '#C8A96A', color: '#C8A96A', borderRadius: '8px' }} onClick={() => navigate('/recharge')}>
                                                Make a Payment
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                                );
                            })()}

                            {/* ── Grievances ── */}
                            {tabValue === 4 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#C8A96A', fontWeight: 700, borderBottom: '3px solid #C8A96A', pb: 1, display: 'inline-block', width: 'fit-content' }}>
                                            My Grievances / Tickets
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AssignmentIcon />}
                                            sx={{
                                                alignSelf: { xs: 'flex-start', sm: 'auto' },
                                                bgcolor: '#C8A96A',
                                                '&:hover': { bgcolor: 'rgba(200,169,106,0.8)' },
                                                borderRadius: '8px',
                                                fontWeight: 700,
                                                textTransform: 'none',
                                                boxShadow: 'none'
                                            }}
                                            onClick={() => navigate('/grievance')}
                                        >
                                            Submit Complain
                                        </Button>
                                    </Box>
                                    {grievancesLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={40} sx={{ color: '#C8A96A' }} /></Box>
                                    ) : userGrievances.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <SupportAgentIcon sx={{ fontSize: 80, color: 'rgba(200, 169, 106, 0.4)', mb: 2 }} />
                                            <Typography variant="h6" color="textSecondary" gutterBottom>No Grievances Found</Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>You haven't submitted any grievances yet</Typography>
                                            <Button variant="contained" startIcon={<AssignmentIcon />} sx={{ bgcolor: '#C8A96A', '&:hover': { bgcolor: '#e67e22' } }} onClick={() => navigate('/grievance')}>Submit a Grievance</Button>
                                        </Box>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {userGrievances.map((grievance, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <Zoom in={showContent} timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                                                        <Card variant="outlined" sx={{ '&:hover': { boxShadow: '0 8px 24px rgba(200, 169, 106, 0.12)', borderColor: '#C8A96A' }, transition: 'all 0.3s ease', borderRadius: '14px', overflow: 'hidden' }}>
                                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 0 }}>
                                                                <Box sx={{ p: 3, flex: 1.5 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                                        <Typography variant="caption" sx={{ color: '#C8A96A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: 'rgba(200, 169, 106, 0.1)', px: 1.5, py: 0.5, borderRadius: '6px' }}>
                                                                            <SupportAgentIcon sx={{ fontSize: 16 }} /> {grievance.ticket}
                                                                        </Typography>
                                                                        {grievance.category && <Chip label={grievance.category} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, color: 'rgba(200, 169, 106, 0.8)', bgcolor: '#f0f0f0' }} />}
                                                                    </Box>
                                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5E6C8', mb: 1.5, fontSize: '1.15rem' }}>{grievance.subject || 'No Subject Provided'}</Typography>
                                                                    <Typography variant="body2" sx={{ color: 'rgba(200, 169, 106, 0.8)', fontSize: '0.9rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{grievance.message || '—'}</Typography>
                                                                    <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                                        <Box>
                                                                            <Typography variant="caption" sx={{ color: 'rgba(200, 169, 106, 0.8)', textTransform: 'uppercase', fontWeight: 700, fontSize: '10px' }}>Contact Mobile</Typography>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#F5E6C8' }}>{grievance.mobile || '—'}</Typography>
                                                                        </Box>
                                                                        <Box>
                                                                            <Typography variant="caption" sx={{ color: 'rgba(200, 169, 106, 0.8)', textTransform: 'uppercase', fontWeight: 700, fontSize: '10px' }}>Submitted On</Typography>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#F5E6C8' }}>
                                                                                {new Date(grievance.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                                <Box sx={{ width: { xs: '100%', md: '200px' }, bgcolor: '#0D0D0D', borderLeft: { xs: 'none', md: '1px solid #eaeaea' }, borderTop: { xs: '1px solid #eaeaea', md: 'none' }, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                                                    <StatusChip size="medium" icon={getStatusIcon(grievance.status)} label={grievance.status} status={grievance.status} sx={{ width: '100%', py: 2.2, borderRadius: '8px', flex: { xs: 1, md: 'none' } }} />
                                                                    <Button fullWidth variant="contained" startIcon={<HistoryIcon />}
                                                                        sx={{ bgcolor: '#C8A96A', '&:hover': { bgcolor: 'rgba(200,169,106,0.8)' }, textTransform: 'none', borderRadius: '8px', py: 1.2, fontWeight: 700, boxShadow: 'none', flex: { xs: 1, md: 'none' } }}
                                                                        onClick={() => navigate(`/grievance?ticket=${grievance.ticket}`)}>
                                                                        Track Status
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        </Card>
                                                    </Zoom>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Box>
                            )}

                            {/* ── KYC ── */}
                            {tabValue === 5 && (
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#C8A96A', mb: 3, fontWeight: 700, borderBottom: '3px solid #C8A96A', pb: 1, display: 'inline-block' }}>
                                        KYC Verification
                                    </Typography>
                                    {renderKycForm()}
                                </Box>
                            )}

                        </Box>
                    </AnimatedPaper>
                </Fade>

                {/* Snackbar */}
                <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} TransitionComponent={Slide}>
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled"
                        sx={{ width: '100%', borderRadius: '16px', fontWeight: 800, bgcolor: '#C8A96A', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>

            </Container>
        </FullPageContainer>
    );
};

export default MyAccount;
