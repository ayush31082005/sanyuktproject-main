import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home.jsx'
import Registation from '../pages/Registation.jsx'
import Login from '../pages/Login.jsx'
import ContactUs from '../pages/ContactUs.jsx'
import AboutUs from '../pages/AboutUs.jsx'
import Legal from '../pages/Legal.jsx'
import Grievance from '../pages/Grievance.jsx'
import Product from '../pages/Product.jsx'
import Recharge from '../pages/Recharge.jsx'
import MyAccount from '../pages/MyAccount.jsx'
import UserDashboardLayout from '../layouts/UserDashboardLayout.jsx'
import DashboardOverview from '../pages/DashboardOverview.jsx'
import Construction from '../pages/Construction.jsx'
import BinaryTreeView from '../pages/BinaryTreeView.jsx'
import UserTable from '../components/UserTable.jsx'
import Gallery from '../pages/Gallery.jsx'
import Donate from '../pages/Donate.jsx'

import Opportunities from '../pages/Opportunities.jsx'
import CompensationPlan from '../pages/CompensationPlan.jsx'
import ExchangePolicy from '../footerPages/ExchangePolicy.jsx'
import MarketingSalesPolicy from '../footerPages/MarketingSalesPolicy.jsx'
import PaymentPolicy from '../footerPages/PaymentPolicy.jsx'
import PrivacyPolicy from '../footerPages/PrivacyPolicy.jsx'
import TermsConditions from '../footerPages/TermsConditions.jsx'
import RefundCancellationPolicy from '../footerPages/RefundCancellationPolicy.jsx'
import ShipmentDeliveryPolicy from '../footerPages/ShipmentDeliveryPolicy.jsx'
import OrderPolicy from '../footerPages/OrderPolicy.jsx'
import TestimonialPolicy from '../footerPages/TestimonialPolicy.jsx'
import OurBanker from '../footerPages/OurBanker.jsx'
import VerifyOTP from '../pages/VerifyOTP.jsx'
import Checkout from '../pages/Checkout.jsx'
import Cart from '../pages/Cart.jsx'
import Franchise from '../pages/Franchise.jsx'
import FranchiseLogin from '../pages/FranchiseLogin.jsx';
import OrderDetails from '../pages/OrderDetails.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import FranchiseDashboard from '../pages/FranchiseDashboard.jsx'
import FranchiseRoute from '../routes/FranchiseRoute.jsx'
import Events from "../pages/Events.jsx"

import SelfRepurchaseIncome from '../pages/RepurchaseBonus/SelfRepurchaseIncome.jsx'
import RepurchaseLevelIncome from '../pages/RepurchaseBonus/RepurchaseLevelIncome.jsx';
import SponsorIncome from '../pages/RepurchaseBonus/SponsorIncome.jsx';
import RoyaltyBonus from '../pages/RepurchaseBonus/RoyaltyBonus.jsx';
import DirectorBonus from '../pages/RepurchaseBonus/DirectorBonus.jsx';
import HouseFund from '../pages/RepurchaseBonus/HouseFund.jsx';
import LeadershipFund from '../pages/RepurchaseBonus/LeadershipFund.jsx';
import CarFund from '../pages/RepurchaseBonus/CarFund.jsx';
import TravelFund from '../pages/RepurchaseBonus/TravelFund.jsx';
import BikeFund from '../pages/RepurchaseBonus/BikeFund.jsx';

import MyRank from '../pages/Myrank';

import WalletManagement from '../pages/Wallet/WalletManagement';
import AllTransactionReport from '../pages/Wallet/AllTransactionReport';
import DeductionReport from '../pages/Wallet/DeductionReport';
import WithdrawalHistory from '../pages/Wallet/WithdrawalHistory';
import DailyClosingReport from '../pages/Wallet/DailyClosingReport';
import WelcomeLetter from '../pages/WelcomeLetter.jsx';
import IdCard from '../pages/IdCard.jsx';

import SilverMatching from '../pages/RepurchaseBonus/Silvermatching';
import GoldMatching from '../pages/RepurchaseBonus/Goldmatching';
import DiamondMatching from '../pages/RepurchaseBonus/Diamondmatching';

import GenerationWallet from '../pages/Generation/GenerationWallet';
import GenerationDeduction from '../pages/Generation/GenerationDeduction';
import GenerationWithdrawal from '../pages/Generation/GenerationWithdrawal';
import GenerationTransactions from '../pages/Generation/GenerationTransactions';
import MonthlyClosing from '../pages/Generation/MonthlyClosing';

import FirstPurchase from '../pages/ProductOrder/FirstPurchase.jsx'
import RepurchaseProduct from '../pages/ProductOrder/RepurchaseProduct.jsx'
import OrderHistoryPage from '../pages/ProductOrder/OrderHistoryPage.jsx'
import ProductWalletRequest from '../pages/ProductOrder/ProductWallletRequest.jsx'
import ProductWalletTransaction from '../pages/ProductOrder/ProductWalletTransaction.jsx'
import RepurchaseWalletTransaction from '../pages/ProductOrder/RepurchaseWalletTransaction.jsx'

// ✅ Admin imports
import AdminLayout from '../layouts/AdminLayout.jsx'
import AdminDashboard from '../pages/admin/Dashboard.jsx'
import AdminUsers from '../pages/admin/Users.jsx'
import AdminProducts from '../pages/admin/Products.jsx'
import AdminFranchise from '../pages/admin/Franchise.jsx'
import AdminRoute from '../routes/AdminRoutes.jsx'
import AdminGrievance from '../pages/admin/AdminGrievance.jsx'
import AdminOrders from '../pages/admin/Orders.jsx'
import MLMManagement from '../pages/admin/MLMManagement.jsx'
import AdminGallery from '../pages/admin/Gallery.jsx'
import AdminEvents from '../pages/admin/Events.jsx'
import AdminNews from '../pages/admin/AdminNews.jsx'
import AdminWithdrawals from '../pages/admin/Withdrawals.jsx'

const MainRoutes = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Registation />} />
            <Route path='/login' element={<Login />} />
            <Route path='/contact' element={<ContactUs />} />
            <Route path='/company/about' element={<AboutUs />} />
            <Route path='/company/legal' element={<Legal />} />
            <Route path='/grievance' element={<Grievance />} />
            <Route path='/products' element={<Product />} />
            <Route path='/recharge' element={<Recharge />} />
            <Route path='/donate' element={<Donate />} />
            <Route path='/opportunities' element={<Opportunities />} />
            <Route path='/compensation-plan' element={<CompensationPlan />} />
            <Route path='/exchange-policy' element={<ExchangePolicy />} />
            <Route path='/marketing-sales-policy' element={<MarketingSalesPolicy />} />
            <Route path='/payment-policy' element={<PaymentPolicy />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-conditions' element={<TermsConditions />} />
            <Route path='/cancellation-policy' element={<RefundCancellationPolicy />} />
            <Route path='/shipment-delivery-policy' element={<ShipmentDeliveryPolicy />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/order-policy' element={<OrderPolicy />} />
            <Route path='/testimonial-policy' element={<TestimonialPolicy />} />
            <Route path='/banker' element={<OurBanker />} />
            <Route path='/verify-otp' element={<VerifyOTP />} />
            <Route path='/franchise/list' element={<Franchise />} />
            <Route path='/franchise/login' element={<FranchiseLogin />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/franchise/dashboard' element={
                <FranchiseRoute>
                    <FranchiseDashboard />
                </FranchiseRoute>
            } />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/seminars' element={<Events />} />


            <Route path='/my-account' element={<UserDashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path='profile' element={<MyAccount defaultTab={0} />} />
                <Route path='address' element={<MyAccount defaultTab={1} />} />
                <Route path='orders' element={<MyAccount defaultTab={2} />} />
                <Route path='transactions' element={<MyAccount defaultTab={3} />} />
                <Route path='grievances' element={<MyAccount defaultTab={4} />} />
                <Route path='kyc' element={<MyAccount defaultTab={5} />} />
                <Route path='cart' element={<MyAccount defaultTab={-1} />} />


                <Route path='downline' element={<Construction title="My Downline" />} />
                <Route path='downline/directs' element={<UserTable title="Direct Referrals" type="downline" endpoint="mlm/get-directs" />} />
                <Route path='downline/left-team' element={<UserTable title="Left Team Members" type="downline" endpoint="mlm/get-team-list/left" />} />
                <Route path='downline/right-team' element={<UserTable title="Right Team Members" type="downline" endpoint="mlm/get-team-list/right" />} />
                <Route path='downline/all-team' element={<UserTable title="All Team Members" type="downline" endpoint="mlm/get-team-list/all" />} />
                <Route path='downline/tree-view' element={<BinaryTreeView />} />

                <Route path='orders/first' element={<FirstPurchase />} />
                <Route path='orders/repurchase' element={<RepurchaseProduct />} />
                <Route path='orders/history' element={<OrderHistoryPage />} />
                <Route path='orders/wallet-request' element={<ProductWalletRequest />} />
                <Route path='orders/wallet-transaction' element={<ProductWalletTransaction />} />
                <Route path='orders/repurchase-wallet-transaction' element={<RepurchaseWalletTransaction />} />

                <Route path='bonus/first' element={<Navigate to="/my-account/bonus/first/silver" replace />} />
                <Route path='bonus/first/silver' element={<SilverMatching />} />
                <Route path='bonus/first/gold' element={<GoldMatching />} />
                <Route path='bonus/first/diamond' element={<DiamondMatching />} />
                <Route path='/my-account/rank' element={<MyRank />} />

                <Route path="bonus/repurchase/self" element={<SelfRepurchaseIncome />} />
                <Route path="bonus/repurchase/level" element={<RepurchaseLevelIncome />} />
                <Route path="bonus/repurchase/sponsor" element={<SponsorIncome />} />
                <Route path="bonus/repurchase/royalty" element={<RoyaltyBonus />} />
                <Route path="bonus/repurchase/director" element={<DirectorBonus />} />
                <Route path="bonus/repurchase/house" element={<HouseFund />} />
                <Route path="bonus/repurchase/leadership" element={<LeadershipFund />} />
                <Route path="bonus/repurchase/car" element={<CarFund />} />
                <Route path="bonus/repurchase/travel" element={<TravelFund />} />
                <Route path="bonus/repurchase/bike" element={<BikeFund />} />

                <Route path="wallet/deduction-report" element={<DeductionReport />} />
                <Route path="wallet/withdrawal-history" element={<WithdrawalHistory />} />
                <Route path="wallet/daily-closing" element={<DailyClosingReport />} />
                <Route path='wallet/all-transactions' element={<AllTransactionReport />} />
                <Route path='wallet/management' element={<WalletManagement />} />


                <Route path='generation' element={<GenerationWallet />} />
                <Route path='generation/deduction-report' element={<GenerationDeduction />} />
                <Route path='generation/withdrawal-history' element={<GenerationWithdrawal />} />
                <Route path='generation/all-transactions' element={<GenerationTransactions />} />
                <Route path='generation/monthly-closing' element={<MonthlyClosing />} />
                <Route path='wallet/generation' element={<Navigate to="/my-account/generation" replace />} />
                <Route path='wallet/generation/deduction-report' element={<Navigate to="/my-account/generation/deduction-report" replace />} />
                <Route path='wallet/generation/withdrawal-history' element={<Navigate to="/my-account/generation/withdrawal-history" replace />} />
                <Route path='wallet/generation/all-transactions' element={<Navigate to="/my-account/generation/all-transactions" replace />} />
                <Route path='wallet/generation/monthly-closing' element={<Navigate to="/my-account/generation/monthly-closing" replace />} />

                <Route path='folder' element={<Construction title="My Folder" />} />
                <Route path='folder/welcome-letter' element={<WelcomeLetter />} />
                <Route path='folder/our-banker' element={<OurBanker />} />
                <Route path='folder/id-card' element={<IdCard />} />
            </Route>

            <Route path='/order-details/:id' element={<OrderDetails />} />


            {/* 🔥 Admin Routes (Nested) */}
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminLayout />
                </AdminRoute>
            }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="withdrawals" element={<AdminWithdrawals />} />
                <Route path="franchise" element={<AdminFranchise />} />
                <Route path="grievance" element={<AdminGrievance />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="mlm" element={<MLMManagement />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="seminar" element={<AdminEvents />} />
                <Route path="news" element={<AdminNews />} />


            </Route>


        </Routes>
    )
}

export default MainRoutes

// Dashboard Refined and Verified - Solid Green/Orange Theme Applied
