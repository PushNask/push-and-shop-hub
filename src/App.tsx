import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import AddNewProduct from "./pages/AddNewProduct";
import MyProducts from "./pages/MyProducts";
import PaymentHistory from "./pages/PaymentHistory";
import ProductApprovals from "./pages/ProductApprovals";
import LinkManagement from "./pages/LinkManagement";
import AdminManagement from "./pages/AdminManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/p/:id/details" element={<ProductPage />} />
          <Route path="/seller/add-product" element={<AddNewProduct />} />
          <Route path="/seller/my-products" element={<MyProducts />} />
          <Route path="/seller/payment-history" element={<PaymentHistory />} />
          <Route path="/admin/product-approvals" element={<ProductApprovals />} />
          <Route path="/admin/link-management" element={<LinkManagement />} />
          <Route path="/admin/admin-management" element={<AdminManagement />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;