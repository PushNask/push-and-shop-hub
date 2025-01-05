import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LinkManagement from "@/pages/LinkManagement";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("LinkManagement", () => {
  it("renders the link management title", () => {
    renderWithProviders(<LinkManagement />);
    expect(screen.getByText("Link Slots")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    renderWithProviders(<LinkManagement />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("shows error message when data fetching fails", async () => {
    vi.mock("@/hooks/useLinkSlots", () => ({
      useLinkSlots: () => ({
        error: new Error("Failed to fetch"),
        isLoading: false,
        linkSlots: [],
      }),
    }));

    renderWithProviders(<LinkManagement />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load link slots/i)).toBeInTheDocument();
    });
  });

  it("displays correct slot types", async () => {
    renderWithProviders(<LinkManagement />);
    
    const featuredBadges = await screen.findAllByText("Featured");
    const standardBadges = await screen.findAllByText("Standard");
    
    expect(featuredBadges).toHaveLength(12);
    expect(standardBadges.length).toBeGreaterThan(0);
  });

  it("opens product assignment dialog when clicking assign button", async () => {
    renderWithProviders(<LinkManagement />);
    
    const assignButton = await screen.findByText("Assign");
    fireEvent.click(assignButton);
    
    expect(screen.getByText(/Select a product to assign to this slot/i)).toBeInTheDocument();
  });
});