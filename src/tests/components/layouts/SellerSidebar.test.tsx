import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SellerSidebar } from "@/components/layouts/SellerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

describe("SellerSidebar", () => {
  const renderSidebar = () => {
    return render(
      <MemoryRouter>
        <SidebarProvider>
          <SellerSidebar />
        </SidebarProvider>
      </MemoryRouter>
    );
  };

  it("renders all navigation links", () => {
    renderSidebar();
    
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("displays correct icons for each link", () => {
    renderSidebar();
    
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6); // Including the header link
    
    // Check if icons are present
    expect(document.querySelector('[data-lucide="package"]')).toBeInTheDocument();
    expect(document.querySelector('[data-lucide="plus"]')).toBeInTheDocument();
    expect(document.querySelector('[data-lucide="credit-card"]')).toBeInTheDocument();
    expect(document.querySelector('[data-lucide="bar-chart-3"]')).toBeInTheDocument();
    expect(document.querySelector('[data-lucide="settings"]')).toBeInTheDocument();
  });

  it("has correct navigation paths", () => {
    renderSidebar();
    
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/seller"); // Header link
    expect(links[1]).toHaveAttribute("href", "/seller/products");
    expect(links[2]).toHaveAttribute("href", "/seller/add-product");
    expect(links[3]).toHaveAttribute("href", "/seller/transactions");
    expect(links[4]).toHaveAttribute("href", "/seller/analytics");
    expect(links[5]).toHaveAttribute("href", "/seller/profile");
  });
});