import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabase } from "@/integrations/supabase/client";
import LinkSlotRedirect from "@/pages/LinkSlotRedirect";
import { toast } from "sonner";

// Mock dependencies
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("LinkSlotRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Define a type for our mock query builder that matches what we're using
  type MockQueryBuilder = {
    select: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
    single: ReturnType<typeof vi.fn>;
    url: string;
    headers: Record<string, string>;
    insert: ReturnType<typeof vi.fn>;
    upsert: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    filter: ReturnType<typeof vi.fn>;
  };

  const mockQueryBuilder: MockQueryBuilder = {
    select: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    url: "",
    headers: {},
    insert: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    filter: vi.fn(),
  };

  const renderWithRouter = (slot: string) => {
    return render(
      <MemoryRouter initialEntries={[`/P${slot}`]}>
        <Routes>
          <Route path="/P:slot" element={<LinkSlotRedirect />} />
          <Route path="/products/:id" element={<div>Product Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("shows loading state initially", () => {
    renderWithRouter("1");
    expect(screen.getByText(/Loading product/i)).toBeInTheDocument();
  });

  it("redirects to product page when slot is found", async () => {
    const mockProduct = { id: "123", status: "approved" };
    vi.mocked(supabase.from).mockReturnValue({
      ...mockQueryBuilder,
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockProduct, error: null }),
    } as any);

    renderWithRouter("1");

    await waitFor(() => {
      expect(screen.getByText("Product Page")).toBeInTheDocument();
    });
  });

  it("shows error toast and redirects to home when slot is invalid", async () => {
    renderWithRouter("invalid");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid link slot");
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("shows error toast when no product is found in slot", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      ...mockQueryBuilder,
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    } as any);

    renderWithRouter("1");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("No product found in this slot");
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  it("shows error toast when database query fails", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      ...mockQueryBuilder,
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ 
        data: null, 
        error: new Error("Database error") 
      }),
    } as any);

    renderWithRouter("1");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to load product");
      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });
});