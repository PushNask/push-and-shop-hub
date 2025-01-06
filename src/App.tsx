import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ProductPage from "@/pages/ProductPage";
import UserProfile from "@/pages/UserProfile";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminManagement from "@/pages/AdminManagement";
import ProductApprovals from "@/pages/ProductApprovals";
import TransactionHistory from "@/pages/TransactionHistory";
import AdminProfile from "@/pages/AdminProfile";
import LinkManagement from "@/pages/LinkManagement";
import LinkSlotRedirect from "@/pages/LinkSlotRedirect";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/P:slot" element={<LinkSlotRedirect />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="users" element={<AdminManagement />} />
          <Route path="links" element={<LinkManagement />} />
          <Route path="product-approvals" element={<ProductApprovals />} />
          <Route path="transactions" element={<TransactionHistory />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;