import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { PermanentLinkSlot } from "@/components/product/PermanentLinkSlot";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import Index from "@/pages/Index";
import ProductPage from "@/pages/ProductPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import AdminDashboard from "@/pages/AdminDashboard";
import LinkManagement from "@/pages/LinkManagement";
import ProductApproval from "@/pages/ProductApproval";
import UserManagement from "@/pages/UserManagement";
import Analytics from "@/pages/Analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/P:slot" element={<PermanentLinkSlot />} />
              <Route path="/products/:id" element={<ProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/links" element={<LinkManagement />} />
                <Route path="/admin/approvals" element={<ProductApproval />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/analytics" element={<Analytics />} />
              </Route>
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;