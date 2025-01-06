import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ProductPage from "@/pages/ProductPage";
import UserProfile from "@/pages/UserProfile";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { SellerLayout } from "@/components/layouts/SellerLayout";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminManagement from "@/pages/AdminManagement";
import ProductApprovals from "@/pages/ProductApprovals";
import TransactionHistory from "@/pages/TransactionHistory";
import AdminProfile from "@/pages/AdminProfile";
import LinkManagement from "@/pages/LinkManagement";
import LinkSlotRedirect from "@/pages/LinkSlotRedirect";
import AddNewProduct from "@/pages/AddNewProduct";
import MyProducts from "@/pages/MyProducts";
import SellerProfile from "@/pages/SellerProfile";
import SellerAnalytics from "@/pages/SellerAnalytics";
import PaymentHistory from "@/pages/PaymentHistory";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/P:slot" element={<LinkSlotRedirect />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="users" element={<AdminManagement />} />
          <Route path="links" element={<LinkManagement />} />
          <Route path="product-approvals" element={<ProductApprovals />} />
          <Route path="transactions" element={<TransactionHistory />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Seller routes */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="add-product" element={<AddNewProduct />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="profile" element={<SellerProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;