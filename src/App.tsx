import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { SellerRoute } from "@/components/auth/SellerRoute";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MarketplaceLayout } from "@/components/layouts/MarketplaceLayout";
import { AddProductForm } from "@/components/seller/products/AddProductForm";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AdminSellers = lazy(() => import("@/pages/admin/Sellers"));
const AdminTransactions = lazy(() => import("@/pages/admin/Transactions"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));

const SellerDashboard = lazy(() => import("@/pages/seller/Dashboard"));
const SellerProducts = lazy(() => import("@/pages/seller/Products"));
const SellerTransactions = lazy(() => import("@/pages/seller/Transactions"));
const SellerSettings = lazy(() => import("@/pages/seller/Settings"));

const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const SearchResults = lazy(() => import("@/pages/SearchResults"));
const CategoryProducts = lazy(() => import("@/pages/CategoryProducts"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MarketplaceLayout />}>
          <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

        <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        <Route element={
          <ProtectedRoute>
            <DashboardLayout title="Dashboard">
              <Outlet />
            </DashboardLayout>
          </ProtectedRoute>
        }>
          <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/seller" element={<SellerRoute />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="transactions" element={<SellerTransactions />} />
          <Route path="settings" element={<SellerSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
