import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LinkSlotRedirect from "@/pages/LinkSlotRedirect";
import { toast } from "sonner";

// Mock the dependencies
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      }))
    }))
  }
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn()
  }
}));

describe("LinkSlotRedirect", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const renderWithProviders = (slot: string) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/P${slot}`]}>
          <Routes>
            <Route path="/P:slot" element={<LinkSlotRedirect />} />
            <Route path="/products/:id" element={<div>Product Page</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    renderWithProviders("1");
    expect(screen.getByText(/Loading product/i)).toBeInTheDocument();
  });

  it("redirects to product page when slot is found", async () => {
    const mockProduct = { id: "123", status: "approved" };
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProduct, error: null })
    }));

    renderWithProviders("1");

    await waitFor(() => {
      expect(screen.getByText("Product Page")).toBeInTheDocument();
    });
  });

  it("shows error toast and redirects to home when slot is invalid", async () => {
    renderWithProviders("invalid");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid link slot");
    });
  });

  it("shows error toast and redirects to home when slot is out of range", async () => {
    renderWithProviders("121");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid link slot");
    });
  });

  it("shows error toast when no product is found in slot", async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null })
    }));

    renderWithProviders("1");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("No product found in this slot");
    });
  });

  it("shows error toast when database query fails", async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: null, 
        error: new Error("Database error") 
      })
    }));

    renderWithProviders("1");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load product");
    });
  });
});