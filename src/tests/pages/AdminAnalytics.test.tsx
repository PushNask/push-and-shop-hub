import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminAnalytics from "@/pages/AdminAnalytics";
import { BrowserRouter } from "react-router-dom";

// Mock the recharts components to avoid SVG rendering issues in tests
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
}));

const renderAdminAnalytics = () => {
  return render(
    <BrowserRouter>
      <AdminAnalytics />
    </BrowserRouter>
  );
};

describe("AdminAnalytics", () => {
  it("renders the analytics dashboard title", () => {
    renderAdminAnalytics();
    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
  });

  it("displays all metric cards", () => {
    renderAdminAnalytics();
    expect(screen.getByText("Active Visitors")).toBeInTheDocument();
    expect(screen.getByText("Weekly Revenue")).toBeInTheDocument();
    expect(screen.getByText("Pending Approvals")).toBeInTheDocument();
    expect(screen.getByText("Total Products")).toBeInTheDocument();
  });

  it("displays correct metric values", () => {
    renderAdminAnalytics();
    expect(screen.getByText("342")).toBeInTheDocument(); // Active Visitors
    expect(screen.getByText("$1500")).toBeInTheDocument(); // Weekly Revenue
    expect(screen.getByText("12")).toBeInTheDocument(); // Pending Approvals
    expect(screen.getByText("120")).toBeInTheDocument(); // Total Products
  });

  it("renders the weekly trends chart", () => {
    renderAdminAnalytics();
    expect(screen.getByText("Weekly Trends")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("renders the top categories chart", () => {
    renderAdminAnalytics();
    expect(screen.getByText("Top Categories")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("displays recent activity section", () => {
    renderAdminAnalytics();
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    // Check for specific activity items
    expect(screen.getByText(/iPhone 13 Pro/)).toBeInTheDocument();
    expect(screen.getByText(/Samsung Galaxy S24/)).toBeInTheDocument();
  });

  it("renders all chart components correctly", () => {
    renderAdminAnalytics();
    expect(screen.getAllByTestId("x-axis")).toHaveLength(2); // One for each chart
    expect(screen.getAllByTestId("y-axis")).toHaveLength(2);
    expect(screen.getAllByTestId("tooltip")).toHaveLength(2);
  });
});