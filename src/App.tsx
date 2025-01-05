import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ProductApprovals from "@/pages/ProductApprovals";
import AdminProfile from "@/pages/AdminProfile";
import SellerProfile from "@/pages/SellerProfile";
import UserProfile from "@/pages/UserProfile";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminManagement from "@/pages/AdminManagement";
import TransactionHistory from "@/pages/TransactionHistory";
import LinkManagement from "@/pages/LinkManagement";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <main className="flex-1">
                  <Index />
                </main>
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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
          <Route path="/seller/profile" element={<SellerProfile />} />
          
          {/* User routes */}
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;