import React, { useState, useEffect } from 'react';
import {
    BadgeIndianRupee,
    CreditCard,
    FileBadge,
    FileText,
    LayoutDashboard,
    Package,
    ShieldCheck,
    TrendingUp,
    UserCircle2,
    UserPlus,
    Users,
    Download,
    X,
    Eye
} from 'lucide-react';
import api, { API_URL } from '../api';

const FranchiseDashboard = ({ user, onLogout }) => {
    const API_BASE_URL = API_URL;
    const getStoredFranchiseData = () => {
        try {
            return JSON.parse(localStorage.getItem('franchiseData') || '{}');
        } catch (error) {
            console.error('Error reading franchise data from storage:', error);
            return {};
        }
    };

    const getStoredFranchiseIdentifier = () => {
        const franchiseData = getStoredFranchiseData();
        return franchiseData.franchiseId || franchiseData.id || franchiseData._id || '';
    };

    const resolveImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const [activeTab, setActiveTab] = useState('dashboard');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dashboardId, setDashboardId] = useState(null);
    const [franchiseSession] = useState(() => getStoredFranchiseData());
    const [showViewReportModal, setShowViewReportModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // Member Management State
    const [members, setMembers] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterPackage, setFilterPackage] = useState('All Packages');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [memberPage, setMemberPage] = useState(1);
    const memberPageSize = 10;
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);
    const [showViewMemberModal, setShowViewMemberModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [newMember, setNewMember] = useState({
        name: '',
        mobile: '',
        package: 'Silver',
        status: 'Active'
    });

    // Profile State
    const [profileData, setProfileData] = useState({
        photoUrl: '',
        franchiseName: '',
        ownerName: user?.name || '',
        mobile: '',
        email: '',

        address: {
            shopAddress: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        },

        professional: {
            gstNumber: '',
            panNumber: '',
            businessType: 'Retail Shop'
        },

        bankDetails: {
            accountHolderName: '',
            accountNumber: '',
            bankName: '',
            ifsc: '',
            accountType: 'Savings',
            upiId: ''
        },

        documents: {
            panCard: '',
            aadhaarCard: '',
            gstCertificate: ''
        }
    });

    // File upload states
    const [panFile, setPanFile] = useState(null);
    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [gstFile, setGstFile] = useState(null);
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [saveStatus, setSaveStatus] = useState('');
    const displayName = franchiseSession.name || profileData.ownerName || profileData.franchiseName || 'Franchise Partner';
    const displayFranchiseId = franchiseSession.franchiseId || franchiseSession.id || franchiseSession._id || dashboardId || 'N/A';
    const displayInitial = displayName?.charAt(0)?.toUpperCase() || 'F';

    // Load saved profile from backend on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const franchiseId = getStoredFranchiseIdentifier();

                if (franchiseId) {
                    const response = await api.get(`franchise/dashboard/${franchiseId}`);
                    if (response.data) {
                        setProfileData(response.data);
                        setDashboardId(response.data._id);
                    }
                }
            } catch {
                console.log('No existing profile found, will create new one');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfileData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle file selection
    const handleFileSelect = (docType, e) => {
        const file = e.target.files[0];
        if (file) {
            switch (docType) {
                case 'profilePhoto':
                    setProfilePhotoFile(file);
                    break;
                case 'panCard':
                    setPanFile(file);
                    break;
                case 'aadhaarCard':
                    setAadhaarFile(file);
                    break;
                case 'gstCertificate':
                    setGstFile(file);
                    break;
            }

            alert(`${docType === 'profilePhoto' ? 'Profile photo' :
                docType === 'panCard' ? 'PAN Card' :
                    docType === 'aadhaarCard' ? 'Aadhaar Card' : 'GST Certificate'} selected: ${file.name}`);
        }
    };

    // Save to backend
    const handleSaveToBackend = async () => {
        try {
            setLoading(true);
            setSaveStatus('saving');

            const formData = new FormData();

            const franchiseId = getStoredFranchiseIdentifier();

            if (!franchiseId) {
                throw new Error('Franchise ID not found. Please login again.');
            }

            formData.append('franchiseName', profileData.franchiseName || '');
            formData.append('ownerName', profileData.ownerName || '');
            formData.append('mobile', profileData.mobile || '');
            formData.append('email', profileData.email || '');

            formData.append('address[shopAddress]', profileData.address?.shopAddress || '');
            formData.append('address[city]', profileData.address?.city || '');
            formData.append('address[state]', profileData.address?.state || '');
            formData.append('address[pincode]', profileData.address?.pincode || '');
            formData.append('address[country]', profileData.address?.country || 'India');

            formData.append('professional[gstNumber]', profileData.professional?.gstNumber || '');
            formData.append('professional[panNumber]', profileData.professional?.panNumber || '');
            formData.append('professional[businessType]', profileData.professional?.businessType || 'Retail Shop');

            formData.append('bankDetails[accountHolderName]', profileData.bankDetails?.accountHolderName || '');
            formData.append('bankDetails[accountNumber]', profileData.bankDetails?.accountNumber || '');
            formData.append('bankDetails[bankName]', profileData.bankDetails?.bankName || '');
            formData.append('bankDetails[ifsc]', profileData.bankDetails?.ifsc || '');
            formData.append('bankDetails[accountType]', profileData.bankDetails?.accountType || 'Savings');
            formData.append('bankDetails[upiId]', profileData.bankDetails?.upiId || '');

            formData.append('franchiseId', franchiseId);

            if (profilePhotoFile) {
                formData.append('profilePhoto', profilePhotoFile);
            }

            if (panFile) {
                formData.append('panCard', panFile);
            }
            if (aadhaarFile) {
                formData.append('aadhaarCard', aadhaarFile);
            }
            if (gstFile) {
                formData.append('gstCertificate', gstFile);
            }

            const response = await api.post('franchise/create-dashboard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setDashboardId(response.data.data._id);
                setProfileData(response.data.data);
                setSaveStatus('success');
                setTimeout(() => setSaveStatus(''), 3000);
                alert('Profile saved to database successfully!');
                setIsEditing(false);

                setPanFile(null);
                setAadhaarFile(null);
                setGstFile(null);
                setProfilePhotoFile(null);
            }
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus('error');

            const errorMessage = error.response?.data?.message || error.message;
            alert('Error saving profile: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!profileData.franchiseName?.trim()) {
            newErrors.franchiseName = 'Franchise name is required';
        }

        if (!profileData.ownerName?.trim()) {
            newErrors.ownerName = 'Owner name is required';
        }

        if (!profileData.mobile || !/^\d{10}$/.test(profileData.mobile)) {
            newErrors.mobile = 'Valid 10-digit mobile number required';
        }

        if (!profileData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
            newErrors.email = 'Valid email address required';
        }

        if (!profileData.address?.shopAddress?.trim()) {
            newErrors['address.shopAddress'] = 'Shop address is required';
        }

        if (!profileData.address?.city?.trim()) {
            newErrors['address.city'] = 'City is required';
        }

        if (!profileData.address?.state?.trim()) {
            newErrors['address.state'] = 'State is required';
        }

        if (!profileData.address?.pincode?.trim()) {
            newErrors['address.pincode'] = 'Pincode is required';
        }

        // Optional formatted fields
        if (profileData.professional?.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profileData.professional.panNumber)) {
            newErrors['professional.panNumber'] = 'Valid PAN number required (e.g., ABCDE1234F)';
        }

        if (profileData.bankDetails?.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(profileData.bankDetails.ifsc)) {
            newErrors['bankDetails.ifsc'] = 'Valid IFSC code required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save changes
    const handleSaveChanges = () => {
        if (validateForm()) {
            handleSaveToBackend();
        } else {
            alert('Please fix validation errors before saving');
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
        setPanFile(null);
        setAadhaarFile(null);
        setGstFile(null);
    };

    // Load members from backend
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get("members");
                if (response.data?.success && Array.isArray(response.data.data)) {
                    setMembers(
                        response.data.data.map((m) => ({
                            _id: m._id,
                            id: m.memberId || m.id || "",
                            name: m.name || "",
                            mobile: m.mobile || "",
                            package: m.package || "Silver",
                            status: m.status || "Active",
                            date: m.joiningDate
                                ? new Date(m.joiningDate).toISOString().split("T")[0]
                                : "",
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching members:", error);
                alert("Unable to load members from server. Please try again later.");
            }
        };

        fetchMembers();
    }, []);

    // Filter members
    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.mobile.includes(searchTerm);

        const matchesPackage = filterPackage === 'All Packages' || member.package === filterPackage;
        const matchesStatus = filterStatus === 'All Status' || member.status === filterStatus;

        return matchesSearch && matchesPackage && matchesStatus;
    });

    const totalMemberPages = Math.max(1, Math.ceil(filteredMembers.length / memberPageSize));
    const currentMemberPage = Math.min(memberPage, totalMemberPages);
    const memberPageStart = (currentMemberPage - 1) * memberPageSize;
    const memberPageEnd = memberPageStart + memberPageSize;
    const paginatedMembers = filteredMembers.slice(memberPageStart, memberPageEnd);

    // Add new member
    const handleAddMember = async () => {
        if (!newMember.name || !newMember.mobile) {
            alert('Please fill all required fields');
            return;
        }

        if (!/^\d{10}$/.test(newMember.mobile)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            const payload = {
                name: newMember.name,
                mobile: newMember.mobile,
                package: newMember.package,
                status: newMember.status,
            };

            const response = await api.post("members/add", payload);

            if (response.data?.success && response.data.data) {
                const m = response.data.data;
                const today = m.joiningDate
                    ? new Date(m.joiningDate).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0];

                const createdMember = {
                    _id: m._id,
                    id: m.memberId || m.id || "",
                    name: m.name || "",
                    mobile: m.mobile || "",
                    package: m.package || "Silver",
                    status: m.status || "Active",
                    date: today,
                };

                setMembers([createdMember, ...members]);
                setShowAddMemberModal(false);
                setNewMember({ name: "", mobile: "", package: "Silver", status: "Active" });
                alert("Member added successfully!");
            } else {
                alert("Failed to add member. Please try again.");
            }
        } catch (error) {
            console.error("Add member error:", error);
            const msg = error.response?.data?.message || error.message;
            alert("Error adding member: " + msg);
        }
    };

    // Edit member
    const handleEditMember = async () => {
        if (!selectedMember) return;

        if (!/^\d{10}$/.test(selectedMember.mobile)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            const memberDoc = members.find((m) => m.id === selectedMember.id);
            if (!memberDoc?._id) {
                alert("Cannot update this member because internal ID is missing.");
                return;
            }

            const payload = {
                name: selectedMember.name,
                mobile: selectedMember.mobile,
                package: selectedMember.package,
                status: selectedMember.status,
            };

            const response = await api.put(`members/${memberDoc._id}`, payload);

            if (response.data?.success && response.data.data) {
                const updated = response.data.data;
                const updatedMember = {
                    _id: updated._id,
                    id: updated.memberId || updated.id || selectedMember.id,
                    name: updated.name || "",
                    mobile: updated.mobile || "",
                    package: updated.package || "Silver",
                    status: updated.status || "Active",
                    date: updated.joiningDate
                        ? new Date(updated.joiningDate).toISOString().split("T")[0]
                        : selectedMember.date,
                };

                setMembers(
                    members.map((m) => (m._id === updatedMember._id ? updatedMember : m))
                );
                setShowEditMemberModal(false);
                setSelectedMember(null);
                alert("Member updated successfully!");
            } else {
                alert("Failed to update member. Please try again.");
            }
        } catch (error) {
            console.error("Update member error:", error);
            const msg = error.response?.data?.message || error.message;
            alert("Error updating member: " + msg);
        }
    };

    // Delete member
    const handleDeleteMember = async () => {
        if (!selectedMember) return;
        try {
            const memberDoc = members.find((m) => m.id === selectedMember.id);
            if (!memberDoc?._id) {
                alert("Cannot delete this member because internal ID is missing.");
                return;
            }

            const response = await api.delete(`members/${memberDoc._id}`);
            if (response.data?.success) {
                setMembers(members.filter((m) => m._id !== memberDoc._id));
                setShowDeleteConfirm(false);
                setSelectedMember(null);
                alert("Member deleted successfully!");
            } else {
                alert("Failed to delete member. Please try again.");
            }
        } catch (error) {
            console.error("Delete member error:", error);
            const msg = error.response?.data?.message || error.message;
            alert("Error deleting member: " + msg);
        }
    };

    // Logout handler
    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        console.log("Logging out...");

        localStorage.removeItem('franchiseData');
        sessionStorage.clear();

        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        if (onLogout) {
            onLogout();
        } else {
            window.location.href = "/franchise/login";
        }

        setShowLogoutConfirm(false);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    // Navigation items
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'blue' },
        { id: 'profile', label: 'Profile', icon: '👤', color: 'purple' },
        { id: 'members', label: 'Members', icon: '👥', color: 'blue' },
        { id: 'products', label: 'Products', icon: '📦', color: 'purple' },
        { id: 'income', label: 'Income', icon: '📈', color: 'blue' },
        { id: 'reports', label: 'Reports', icon: '📋', color: 'purple' }
    ];

    // Dashboard Stats
    const stats = [
        { label: 'Total Members', value: members.length.toString(), icon: '👥', change: '+12%', color: 'blue' },
        { label: 'Total Business', value: '₹45.6L', icon: '💰', change: '+8%', color: 'blue' },
        { label: 'Commission', value: '₹1.2L', icon: '💵', change: '+15%', color: 'purple' }
    ];

    // Recent Joinings Data
    const recentJoinings = members.slice(0, 4).map(m => ({
        name: m.name,
        id: m.id,
        date: m.date === new Date().toISOString().split('T')[0] ? 'Today' : m.date,
        package: m.package,
        amount: m.package === 'Gold' ? '₹10,000' : m.package === 'Silver' ? '₹5,000' : '₹25,000'
    }));

    // Products Data
    const products = [
        { id: 1, name: 'Product 1', sku: 'PROD001', price: 1000, image: '📱' },
        { id: 2, name: 'Product 2', sku: 'PROD002', price: 2000, image: '💻' },
        { id: 3, name: 'Product 3', sku: 'PROD003', price: 3000, image: '⌚' },
        { id: 4, name: 'Product 4', sku: 'PROD004', price: 4000, image: '📷' }
    ];

    // Packages Data
    const packages = [
        { name: 'Silver Package', price: '₹5,000', color: 'blue', features: ['Direct Commission: 10%', 'Level Commission: 5%', 'Product Worth: ₹5,000'] },
        { name: 'Gold Package', price: '₹10,000', color: 'purple', features: ['Direct Commission: 12%', 'Level Commission: 7%', 'Product Worth: ₹10,000'] },
        { name: 'Platinum Package', price: '₹25,000', color: 'blue', features: ['Direct Commission: 15%', 'Level Commission: 10%', 'Product Worth: ₹25,000'] }
    ];
    const packageCardStyles = {
        blue: 'bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#F5E6C8] shadow-2xl',
        purple: 'bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#F5E6C8] shadow-2xl'
    };

    const getNavIcon = (label) => {
        switch (label) {
            case 'Dashboard':
                return LayoutDashboard;
            case 'Profile':
                return UserCircle2;
            case 'Members':
                return Users;
            case 'Products':
                return Package;
            case 'Income':
                return TrendingUp;
            case 'Reports':
                return FileText;
            default:
                return LayoutDashboard;
        }
    };

    const getStatIcon = (label) => {
        switch (label) {
            case 'Total Members':
                return Users;
            case 'Today Joinings':
                return UserPlus;
            case 'Total Business':
                return BadgeIndianRupee;
            case 'Commission':
                return TrendingUp;
            default:
                return LayoutDashboard;
        }
    };

    const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

    const convertRowsToCsv = (rows) => {
        if (!rows.length) {
            return 'Message\r\nNo data available\r\n';
        }

        const headers = Object.keys(rows[0]);
        const csvLines = [
            headers.join(','),
            ...rows.map((row) =>
                headers
                    .map((header) => {
                        const value = row[header] ?? '';
                        const stringValue = String(value).replace(/"/g, '""');
                        return `"${stringValue}"`;
                    })
                    .join(',')
            )
        ];

        return csvLines.join('\r\n');
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setShowViewReportModal(true);
    };

    // Income Data
    const incomeHistory = [
        { date: '2024-01-15', type: 'Direct', from: 'FR12345', amount: 1500, status: 'Credited' },
        { date: '2024-01-14', type: 'Level', from: 'FR12346', amount: 750, status: 'Credited' },
        { date: '2024-01-13', type: 'Product', from: 'FR12347', amount: 2000, status: 'Credited' },
        { date: '2024-01-12', type: 'Direct', from: 'FR12348', amount: 3000, status: 'Credited' },
        { date: '2024-01-11', type: 'Level', from: 'FR12349', amount: 1000, status: 'Pending' }
    ];

    const totalCreditedIncome = incomeHistory
        .filter((item) => item.status === 'Credited')
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const reportDefinitions = [
        {
            title: 'Joining Report',
            icon: '📋',
            color: 'gold',
            description: 'Complete list of all member registrations with details',
            rows: (members.length ? members : recentJoinings).map((member, index) => ({
                serialNo: index + 1,
                memberId: member.id || 'N/A',
                name: member.name || 'N/A',
                mobile: member.mobile || 'N/A',
                package: member.package || 'N/A',
                joiningDate: member.date || 'N/A',
                status: member.status || 'N/A'
            }))
        },
        {
            title: 'Income Report',
            icon: '💰',
            color: 'gold',
            description: 'Detailed breakdown of all income transactions',
            rows: incomeHistory.map((item, index) => ({
                serialNo: index + 1,
                date: item.date,
                type: item.type,
                sourceId: item.from,
                amount: formatCurrency(item.amount),
                status: item.status
            }))
        },
        {
            title: 'Purchase Report',
            icon: '🛒',
            color: 'gold',
            description: 'Product purchase history and inventory',
            rows: products.map((product, index) => ({
                serialNo: index + 1,
                productName: product.name,
                sku: product.sku,
                price: formatCurrency(product.price),
                availability: 'In Stock'
            }))
        },
        {
            title: 'Team Business',
            icon: '👥',
            color: 'gold',
            description: 'Team performance and business volume analysis',
            rows: (members.length ? members : recentJoinings).map((member, index) => ({
                serialNo: index + 1,
                memberId: member.id || 'N/A',
                memberName: member.name || 'N/A',
                package: member.package || 'N/A',
                status: member.status || 'N/A',
                businessValue: member.package === 'Gold' ? formatCurrency(10000) : member.package === 'Silver' ? formatCurrency(5000) : formatCurrency(25000)
            }))
        },
        {
            title: 'Daily Report',
            icon: '📅',
            color: 'gold',
            description: 'Today\'s summary and key metrics',
            rows: [
                {
                    generatedDate: new Date().toLocaleDateString('en-GB'),
                    franchiseName: displayName,
                    franchiseId: displayFranchiseId,
                    totalMembers: members.length,
                    totalProducts: products.length,
                    totalPackages: packages.length,
                    creditedIncome: formatCurrency(totalCreditedIncome)
                }
            ]
        },
        {
            title: 'Monthly Report',
            icon: '📊',
            color: 'gold',
            description: 'Comprehensive monthly performance overview',
            rows: [
                {
                    month: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
                    franchiseName: displayName,
                    franchiseId: displayFranchiseId,
                    ownerName: profileData.ownerName || displayName,
                    activeMembers: members.filter((member) => member.status === 'Active').length,
                    totalMembers: members.length,
                    totalPackages: packages.length,
                    totalProducts: products.length,
                    totalIncome: formatCurrency(totalCreditedIncome)
                }
            ]
        }
    ];

    // Render different sections
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D] rounded-none border border-[#C8A96A]/20 shadow-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A96A]/5 rounded-full blur-[100px]"></div>
                            <h2 className="text-3xl font-serif font-bold mb-2 text-[#C8A96A] uppercase tracking-wider">Welcome back, {displayName}! 👋</h2>
                            <p className="text-[#F5E6C8]/60 font-black uppercase tracking-[0.2em] text-[10px]">Your Franchise Performance Overview</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                (() => {
                                    const StatIcon = getStatIcon(stat.label);
                                    return (
                                        <div key={index} className="bg-[#1A1A1A] rounded-none shadow-2xl p-6 border border-[#C8A96A]/10 hover:border-[#C8A96A]/40 transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[#F5E6C8]/40 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                                                    <p className="text-3xl font-serif font-bold text-[#F5E6C8]">{stat.value}</p>
                                                    <p className="text-[10px] font-black text-[#C8A96A] mt-2 tracking-widest">{stat.change}</p>
                                                </div>
                                                <div className="flex h-12 w-12 items-center justify-center bg-[#C8A96A]/10 text-[#C8A96A] shadow-inner group-hover:scale-110 transition-transform">
                                                    <StatIcon size={24} strokeWidth={2.5} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-[#1A1A1A] border border-[#C8A96A]/10 rounded-none shadow-2xl p-8">
                                <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#C8A96A]/10">
                                    <h3 className="text-lg font-serif font-bold text-[#C8A96A] uppercase tracking-wider">Recent Joinings</h3>
                                    <button
                                        onClick={() => setActiveTab('members')}
                                        className="text-[10px] font-black text-[#C8A96A] hover:text-[#F5E6C8] uppercase tracking-[0.2em] transition-colors"
                                    >
                                        View All Members →
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recentJoinings.length > 0 ? (
                                        recentJoinings.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-[#0D0D0D] border border-[#C8A96A]/5 hover:border-[#C8A96A]/30 transition-all">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-[#C8A96A] text-[#0D0D0D] flex items-center justify-center text-lg font-black shadow-lg">
                                                        {item.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-serif font-bold text-[#F5E6C8] text-sm uppercase tracking-tight">{item.name}</p>
                                                        <p className="text-[10px] font-black text-[#C8A96A]/60 uppercase tracking-widest mt-1">ID: {item.id} • {item.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-serif font-bold text-[#C8A96A]">{item.amount}</p>
                                                    <span className="text-[9px] font-black bg-[#C8A96A]/10 text-[#C8A96A] px-3 py-1 uppercase tracking-widest mt-1 inline-block">
                                                        {item.package}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-[#F5E6C8]/20 font-black uppercase tracking-[0.3em] text-[10px]">
                                            No recent joinings found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div className="max-w-5xl mx-auto space-y-6 bg-white">
                        {/* Save Status Indicator */}
                        {saveStatus === 'saving' && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving to database...
                            </div>
                        )}
                        {saveStatus === 'success' && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg">
                                ✓ Profile saved successfully!
                            </div>
                        )}
                        {saveStatus === 'error' && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
                                ✗ Error saving profile. Please try again.
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Profile Management</h2>
                            <div className="flex space-x-3">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                        disabled={loading}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSaveChanges}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Save to Database
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
                                            disabled={loading}
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="h-32 bg-green-600 relative">
                                <div className="absolute -bottom-16 left-8">
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-white rounded-full p-1 shadow-xl overflow-hidden">
                                            {profileData.photoUrl ? (
                                                <img
                                                    src={resolveImageUrl(profileData.photoUrl)}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-green-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                                    {profileData.ownerName?.charAt(0) || 'R'}
                                                </div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <>
                                                <label className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full text-white hover:bg-green-600 shadow-lg cursor-pointer">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileSelect('profilePhoto', e)}
                                                    />
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 px-8 pb-8">
                                <div className="flex flex-wrap items-center justify-between mb-8 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-600">Franchise ID:</span>
                                            <span className="text-sm font-semibold text-gray-800">{displayFranchiseId}</span>
                                        </div>
                                        <div className="h-4 w-px bg-gray-300"></div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-600">Status:</span>
                                            <span className="text-sm font-semibold text-green-600">Active</span>
                                        </div>
                                        {dashboardId && (
                                            <>
                                                <div className="h-4 w-px bg-gray-300"></div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-600">Saved:</span>
                                                    <span className="text-sm font-semibold text-green-600">Yes ✓</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                                Personal Information
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Franchise Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="franchiseName"
                                                        value={profileData.franchiseName || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter franchise name"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Owner Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="ownerName"
                                                        value={profileData.ownerName || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter owner name"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Mobile Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value="+91"
                                                            disabled
                                                            className="w-16 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="mobile"
                                                            value={profileData.mobile || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                            placeholder="Enter 10-digit mobile"
                                                            maxLength="10"
                                                        />
                                                    </div>
                                                    {errors.mobile && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Email Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={profileData.email || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter email address"
                                                    />
                                                    {errors.email && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                                Professional Details
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        GST Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="professional.gstNumber"
                                                        value={profileData.professional?.gstNumber || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter GST number"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        PAN Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="professional.panNumber"
                                                        value={profileData.professional?.panNumber || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter PAN number"
                                                    />
                                                    {errors['professional.panNumber'] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors['professional.panNumber']}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Business Type
                                                    </label>
                                                    {isEditing ? (
                                                        <select
                                                            name="professional.businessType"
                                                            value={profileData.professional?.businessType || 'Retail Shop'}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option>Retail Shop</option>
                                                            <option>Wholesale</option>
                                                            <option>Distributor</option>
                                                            <option>Service Provider</option>
                                                            <option>Manufacturer</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={profileData.professional?.businessType || ''}
                                                            disabled
                                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                                Address Information
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Shop/Office Address <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="address.shopAddress"
                                                        value={profileData.address?.shopAddress || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter shop address"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                                                        <input
                                                            type="text"
                                                            name="address.city"
                                                            value={profileData.address?.city || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                            placeholder="City"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">State</label>
                                                        <input
                                                            type="text"
                                                            name="address.state"
                                                            value={profileData.address?.state || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                            placeholder="State"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">Pincode</label>
                                                        <input
                                                            type="text"
                                                            name="address.pincode"
                                                            value={profileData.address?.pincode || ''}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                            placeholder="Pincode"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                                                        <input
                                                            type="text"
                                                            name="address.country"
                                                            value={profileData.address?.country || 'India'}
                                                            onChange={handleInputChange}
                                                            disabled={!isEditing}
                                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                            placeholder="Country"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                                Bank Details
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Account Holder Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="bankDetails.accountHolderName"
                                                        value={profileData.bankDetails?.accountHolderName || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter account holder name"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Account Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="bankDetails.accountNumber"
                                                        value={profileData.bankDetails?.accountNumber || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter account number"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Bank Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="bankDetails.bankName"
                                                        value={profileData.bankDetails?.bankName || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter bank name"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        IFSC Code <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="bankDetails.ifsc"
                                                        value={profileData.bankDetails?.ifsc || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter IFSC code"
                                                    />
                                                    {errors['bankDetails.ifsc'] && (
                                                        <p className="text-red-500 text-xs mt-1">{errors['bankDetails.ifsc']}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        Account Type
                                                    </label>
                                                    {isEditing ? (
                                                        <select
                                                            name="bankDetails.accountType"
                                                            value={profileData.bankDetails?.accountType || 'Savings'}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option>Savings</option>
                                                            <option>Current</option>
                                                            <option>Salary</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={profileData.bankDetails?.accountType || ''}
                                                            disabled
                                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                                                        />
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                                        UPI ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="bankDetails.upiId"
                                                        value={profileData.bankDetails?.upiId || ''}
                                                        onChange={handleInputChange}
                                                        disabled={!isEditing}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                                                        placeholder="Enter UPI ID"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Section - Using Public Document Images */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                        Documents
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* PAN Card */}
                                        <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    <img
                                                        src="/profile/pan.jpg"
                                                        alt="PAN Card"
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm">PAN Card</p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        {profileData.documents?.panCard || 'Not uploaded'}
                                                    </p>
                                                    {panFile && (
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            New: {panFile.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <div className="mt-3">
                                                    <label className="block">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileSelect('panCard', e)}
                                                            className="hidden"
                                                        />
                                                        <span className="block w-full text-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 cursor-pointer">
                                                            {panFile ? 'Change File' : 'Upload PAN Card'}
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {/* Aadhaar Card */}
                                        <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    <img
                                                        src="/profile/adhar.jpg"
                                                        alt="Aadhaar Card"
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm">Aadhaar Card</p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        {profileData.documents?.aadhaarCard || 'Not uploaded'}
                                                    </p>
                                                    {aadhaarFile && (
                                                        <p className="text-xs text-purple-600 mt-1">
                                                            New: {aadhaarFile.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <div className="mt-3">
                                                    <label className="block">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileSelect('aadhaarCard', e)}
                                                            className="hidden"
                                                        />
                                                        <span className="block w-full text-center px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs hover:bg-purple-100 cursor-pointer">
                                                            {aadhaarFile ? 'Change File' : 'Upload Aadhaar'}
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {/* GST Certificate */}
                                        <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    <img
                                                        src="/profile/gst.jpg"
                                                        alt="GST Certificate"
                                                        className="w-8 h-8 object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 text-sm">GST Certificate</p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        {profileData.documents?.gstCertificate || 'Not uploaded'}
                                                    </p>
                                                    {gstFile && (
                                                        <p className="text-xs text-blue-600 mt-1">
                                                            New: {gstFile.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <div className="mt-3">
                                                    <label className="block">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={(e) => handleFileSelect('gstCertificate', e)}
                                                            className="hidden"
                                                        />
                                                        <span className="block w-full text-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 cursor-pointer">
                                                            {gstFile ? 'Change File' : 'Upload GST'}
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'members':
                return (
                    <div>
                        {/* Add Member Modal */}
                        {showAddMemberModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Add New Member</h3>
                                        <button
                                            onClick={() => setShowAddMemberModal(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newMember.name}
                                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter member name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mobile Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={newMember.mobile}
                                                onChange={(e) => setNewMember({ ...newMember, mobile: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter 10-digit mobile number"
                                                maxLength="10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Package
                                            </label>
                                            <select
                                                value={newMember.package}
                                                onChange={(e) => setNewMember({ ...newMember, package: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option>Silver</option>
                                                <option>Gold</option>
                                                <option>Platinum</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={newMember.status}
                                                onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option>Active</option>
                                                <option>Pending</option>
                                            </select>
                                        </div>
                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                onClick={handleAddMember}
                                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                            >
                                                Add Member
                                            </button>
                                            <button
                                                onClick={() => setShowAddMemberModal(false)}
                                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Member Modal */}
                        {showEditMemberModal && selectedMember && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Edit Member</h3>
                                        <button
                                            onClick={() => {
                                                setShowEditMemberModal(false);
                                                setSelectedMember(null);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Member ID
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedMember.id}
                                                disabled
                                                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedMember.name}
                                                onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mobile Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={selectedMember.mobile}
                                                onChange={(e) => setSelectedMember({ ...selectedMember, mobile: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                maxLength="10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Package
                                            </label>
                                            <select
                                                value={selectedMember.package}
                                                onChange={(e) => setSelectedMember({ ...selectedMember, package: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option>Silver</option>
                                                <option>Gold</option>
                                                <option>Platinum</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={selectedMember.status}
                                                onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option>Active</option>
                                                <option>Pending</option>
                                            </select>
                                        </div>
                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                onClick={handleEditMember}
                                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                                            >
                                                Update Member
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowEditMemberModal(false);
                                                    setSelectedMember(null);
                                                }}
                                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* View Member Modal */}
                        {showViewMemberModal && selectedMember && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Member Details</h3>
                                        <button
                                            onClick={() => {
                                                setShowViewMemberModal(false);
                                                setSelectedMember(null);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                                {selectedMember.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Member ID</p>
                                                <p className="font-semibold text-gray-800">{selectedMember.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Full Name</p>
                                                <p className="font-semibold text-gray-800">{selectedMember.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Mobile Number</p>
                                                <p className="font-semibold text-gray-800">{selectedMember.mobile}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Package</p>
                                                <p className="font-semibold text-gray-800">{selectedMember.package}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Joining Date</p>
                                                <p className="font-semibold text-gray-800">{selectedMember.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Status</p>
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${selectedMember.status === 'Active'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {selectedMember.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowViewMemberModal(false);
                                                setSelectedMember(null);
                                            }}
                                            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 mt-4"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Delete Confirmation Modal */}
                        {showDeleteConfirm && selectedMember && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Member</h3>
                                        <p className="text-gray-600 mb-6">
                                            Are you sure you want to delete {selectedMember.name}? This action cannot be undone.
                                        </p>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleDeleteMember}
                                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowDeleteConfirm(false);
                                                    setSelectedMember(null);
                                                }}
                                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Member Management</h2>
                            <button
                                onClick={() => setShowAddMemberModal(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                            >
                                <span className="mr-2">➕</span> Add New Member
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by ID, Name or Mobile..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <select
                                    value={filterPackage}
                                    onChange={(e) => setFilterPackage(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                    <option>All Packages</option>
                                    <option>Silver</option>
                                    <option>Gold</option>
                                    <option>Platinum</option>
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option>All Status</option>
                                    <option>Active</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                        </div>

                        {/* Members Table */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joining Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedMembers.length > 0 ? (
                                            paginatedMembers.map((member, i) => (
                                                <tr key={i} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{member.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                                {member.name.charAt(0)}
                                                            </div>
                                                            {member.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{member.mobile}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${member.package === 'Gold' ? 'bg-purple-100 text-purple-800' :
                                                            member.package === 'Silver' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-indigo-100 text-indigo-800'
                                                            }`}>
                                                            {member.package}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{member.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                                            }`}>
                                                            {member.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setShowViewMemberModal(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setShowEditMemberModal(true);
                                                            }}
                                                            className="text-purple-600 hover:text-purple-900 mr-3"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMember(member);
                                                                setShowDeleteConfirm(true);
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                    No members found matching your criteria
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {filteredMembers.length === 0 ? 0 : memberPageStart + 1}-
                                    {Math.min(memberPageEnd, filteredMembers.length)} of {filteredMembers.length} entries
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={currentMemberPage === 1}
                                        onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalMemberPages }, (_, idx) => idx + 1)
                                        .slice(
                                            Math.max(0, currentMemberPage - 2),
                                            Math.max(0, currentMemberPage - 2) + 3
                                        )
                                        .map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setMemberPage(page)}
                                                className={`px-3 py-1 rounded ${page === currentMemberPage
                                                    ? "bg-green-600 text-white"
                                                    : "border hover:bg-gray-100"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    <button
                                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={currentMemberPage === totalMemberPages}
                                        onClick={() =>
                                            setMemberPage((p) => Math.min(totalMemberPages, p + 1))
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'products':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Products & Packages</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {packages.map((pkg, i) => (
                                <div
                                    key={i}
                                    className={`${packageCardStyles[pkg.color] || 'bg-gradient-to-br from-green-500 to-green-600 text-white'} rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform`}
                                >
                                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                                    <p className="text-3xl font-bold mb-4">{pkg.price}</p>
                                    <ul className="space-y-2 text-sm mb-6">
                                        {pkg.features.map((feature, j) => (
                                            <li key={j}>✓ {feature}</li>
                                        ))}
                                    </ul>
                                    <button className="w-full bg-white text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-100">
                                        Purchase Now
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Inventory</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
                                            {product.image}
                                        </div>
                                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                        <p className="text-sm text-gray-600">{product.sku}</p>
                                        <p className="text-lg font-bold text-blue-600 mt-2">₹{product.price}</p>
                                        <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                                            Add to Cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'income':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Income Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                                <p className="text-sm text-gray-500">Direct Commission</p>
                                <p className="text-2xl font-bold text-gray-800">₹45,000</p>
                                <p className="text-xs text-blue-600 mt-1">+12% this month</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                                <p className="text-sm text-gray-500">Level Commission</p>
                                <p className="text-2xl font-bold text-gray-800">₹28,500</p>
                                <p className="text-xs text-purple-600 mt-1">+8% this month</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                                <p className="text-sm text-gray-500">Product Commission</p>
                                <p className="text-2xl font-bold text-gray-800">₹32,000</p>
                                <p className="text-xs text-blue-600 mt-1">+15% this month</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                                <p className="text-sm text-gray-500">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-800">₹1,05,500</p>
                                <p className="text-xs text-purple-600 mt-1">+11% this month</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Income History</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {incomeHistory.map((item, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3">{item.date}</td>
                                                <td className="px-4 py-3">{item.type}</td>
                                                <td className="px-4 py-3">{item.from}</td>
                                                <td className="px-4 py-3 font-semibold text-blue-600">₹{item.amount}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Credited' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            case 'reports':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports</h2>

                        {/* View Report Modal */}
                        {showViewReportModal && selectedReport && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 overflow-y-auto">
                                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-2 pb-4 border-b">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{selectedReport.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{selectedReport.description}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowViewReportModal(false);
                                                setSelectedReport(null);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="mb-4 flex justify-between items-center">
                                        <p className="text-sm text-gray-600">
                                            Total Records: <span className="font-bold text-green-700">{selectedReport.rows.length}</span>
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    const csvContent = convertRowsToCsv(selectedReport.rows);
                                                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                                    const url = URL.createObjectURL(blob);
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.download = `${selectedReport.title.toLowerCase().replace(/\s+/g, '-')}.csv`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                    URL.revokeObjectURL(url);
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                                            >
                                                <Download size={14} className="mr-1" />
                                                Download as CSV
                                            </button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {selectedReport.rows.length > 0 && Object.keys(selectedReport.rows[0]).map((header) => (
                                                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            {header.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {selectedReport.rows.map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        {Object.values(row).map((value, i) => (
                                                            <td key={i} className="px-4 py-3 text-gray-800">
                                                                {String(value)}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setShowViewReportModal(false);
                                                setSelectedReport(null);
                                            }}
                                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {reportDefinitions.map((report, i) => (
                                <div key={i} className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-${report.color}-500`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-3xl mb-2 block">{report.icon}</span>
                                            <h3 className="font-semibold text-gray-800">{report.title}</h3>
                                            <p className="text-xs text-gray-400 mt-1">{report.rows.length} records</p>
                                        </div>
                                        <button
                                            onClick={() => handleViewReport(report)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                                        >
                                            <Eye size={14} className="mr-1" />
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🚧</span>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
                        <p className="text-gray-600">This section is under development</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Logout Confirmation</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to logout from your franchise account?</p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={cancelLogout}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="ml-4 lg:ml-0">
                                <h1 className="text-xl font-bold text-green-700">
                                    Franchise Panel
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                                    {profileData.photoUrl ? (
                                        <img
                                            src={resolveImageUrl(profileData.photoUrl)}
                                            alt={displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        displayInitial
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                                    <p className="text-xs text-gray-500">ID: {displayFranchiseId}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-semibold transition-all duration-300 transform hover:scale-105 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs - Desktop */}
                    <nav className="hidden lg:block border-t">
                        <div className="flex space-x-1 overflow-x-auto">
                            {navItems.map((item) => (
                                (() => {
                                    const NavIcon = getNavIcon(item.label);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === item.id
                                                ? `border-${item.color}-600 text-${item.color}-600`
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="mr-2 inline-flex align-middle">
                                                <NavIcon size={16} strokeWidth={2.2} />
                                            </span>
                                            {item.label}
                                        </button>
                                    );
                                })()
                            ))}
                        </div>
                    </nav>

                    {/* Mobile Menu */}
                    {showMobileMenu && (
                        <div className="lg:hidden border-t py-2">
                            {navItems.map((item) => (
                                (() => {
                                    const NavIcon = getNavIcon(item.label);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                setShowMobileMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 font-medium text-sm ${activeTab === item.id
                                                ? `bg-${item.color}-50 text-${item.color}-600`
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="mr-3 inline-flex align-middle">
                                                <NavIcon size={16} strokeWidth={2.2} />
                                            </span>
                                            {item.label}
                                        </button>
                                    );
                                })()
                            ))}

                            {/* Mobile Logout Option */}
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 font-medium text-sm text-red-600 hover:bg-red-50 border-t mt-2"
                            >
                                <span className="mr-3">🚪</span>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default FranchiseDashboard;
