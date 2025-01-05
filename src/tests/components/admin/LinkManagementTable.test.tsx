import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LinkManagementTable } from "@/components/admin/LinkManagementTable";

describe("LinkManagementTable", () => {
  const mockOnAssignProduct = vi.fn();
  const mockLinkSlots = [
    {
      id: "1",
      title: "Test Product",
      link_slot: 1,
      status: "approved",
    },
  ];

  it("renders table headers correctly", () => {
    render(
      <LinkManagementTable
        linkSlots={mockLinkSlots}
        onAssignProduct={mockOnAssignProduct}
        isLoading={false}
      />
    );

    expect(screen.getByText("Slot")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Current Product")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("displays loading skeleton when isLoading is true", () => {
    render(
      <LinkManagementTable
        linkSlots={[]}
        onAssignProduct={mockOnAssignProduct}
        isLoading={true}
      />
    );

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows correct badge for featured slots", () => {
    render(
      <LinkManagementTable
        linkSlots={mockLinkSlots}
        onAssignProduct={mockOnAssignProduct}
        isLoading={false}
      />
    );

    const featuredBadge = screen.getByText("Featured");
    expect(featuredBadge).toBeInTheDocument();
  });

  it("disables assign button when isAssigning is true", () => {
    render(
      <LinkManagementTable
        linkSlots={mockLinkSlots}
        onAssignProduct={mockOnAssignProduct}
        isLoading={false}
        isAssigning={true}
      />
    );

    const assignButton = screen.getByText("Replace");
    expect(assignButton).toBeDisabled();
  });
});