import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { SellerLayout } from "@/components/layouts/SellerLayout";
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
import MyProducts from "@/pages/MyProducts";
import AddNewProduct from "@/pages/AddNewProduct";
import PaymentHistory from "@/pages/PaymentHistory";
import SellerAnalytics from "@/pages/SellerAnalytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Admin routes - placing these first for correct route precedence */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/product-approvals" replace />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="users" element={<AdminManagement />} />
              <Route path="links" element={<LinkManagement />} />
              <Route path="product-approvals" element={<ProductApprovals />} />
              <Route path="transactions" element={<TransactionHistory />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Seller routes */}
            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={<Navigate to="/seller/products" replace />} />
              <Route path="products" element={<MyProducts />} />
              <Route path="add-product" element={<AddNewProduct />} />
              <Route path="transactions" element={<PaymentHistory />} />
              <Route path="analytics" element={<SellerAnalytics />} />
              <Route path="profile" element={<SellerProfile />} />
            </Route>

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

            {/* User routes - placing this after admin/seller routes */}
            <Route path="/profile" element={<UserProfile />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;