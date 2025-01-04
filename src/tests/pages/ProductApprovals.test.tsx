import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductApprovals from '@/pages/ProductApprovals';
import { toast } from 'sonner';

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock product data
const mockPendingProducts = [
  {
    id: "p1",
    title: "iPhone 13 Pro",
    description: "Latest model with advanced features",
    price: 750000,
    images: ["/placeholder.svg"],
    category: "Electronics",
    listingType: "featured",
    seller: {
      id: "s1",
      name: "Tech Store",
      rating: 4.5,
      location: "Douala, Cameroon",
      joinedDate: "2023-12-01"
    },
    submittedAt: "2024-02-20T10:00:00Z"
  },
  {
    id: "p2",
    title: "Samsung TV",
    description: "50-inch Smart TV",
    price: 450000,
    images: ["/placeholder.svg"],
    category: "Electronics",
    listingType: "standard",
    seller: {
      id: "s2",
      name: "Electronics Hub",
      rating: 4.2,
      location: "Yaoundé, Cameroon",
      joinedDate: "2023-11-15"
    },
    submittedAt: "2024-02-19T15:30:00Z"
  }
];

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductApprovals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the product approvals page with title', () => {
    renderWithRouter(<ProductApprovals />);
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
  });

  it('displays pending products in a grid', () => {
    renderWithRouter(<ProductApprovals />);
    const productCards = screen.getAllByRole('article');
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('shows product details including title, price, and seller information', () => {
    renderWithRouter(<ProductApprovals />);
    expect(screen.getByText('iPhone 13 Pro')).toBeInTheDocument();
    expect(screen.getByText('Tech Store')).toBeInTheDocument();
    expect(screen.getByText('XAF 750,000')).toBeInTheDocument();
  });

  it('opens review dialog when clicking Review button', async () => {
    renderWithRouter(<ProductApprovals />);
    const reviewButton = screen.getAllByText('Review')[0];
    fireEvent.click(reviewButton);
    
    await waitFor(() => {
      expect(screen.getByText('Review Product Listing')).toBeInTheDocument();
    });
  });

  it('handles product approval successfully', async () => {
    renderWithRouter(<ProductApprovals />);
    const reviewButton = screen.getAllByText('Review')[0];
    fireEvent.click(reviewButton);
    
    const approveButton = screen.getByText('Approve');
    fireEvent.click(approveButton);
    
    expect(toast.success).toHaveBeenCalledWith('Product approved successfully');
  });

  it('handles product rejection with feedback', async () => {
    renderWithRouter(<ProductApprovals />);
    const reviewButton = screen.getAllByText('Review')[0];
    fireEvent.click(reviewButton);
    
    const feedbackInput = screen.getByPlaceholderText('Enter feedback for the seller (optional)');
    fireEvent.change(feedbackInput, { target: { value: 'Images are not clear' } });
    
    const rejectButton = screen.getByText('Reject');
    fireEvent.click(rejectButton);
    
    expect(toast.success).toHaveBeenCalledWith('Product rejected successfully');
  });

  it('displays seller information in review dialog', async () => {
    renderWithRouter(<ProductApprovals />);
    const reviewButton = screen.getAllByText('Review')[0];
    fireEvent.click(reviewButton);
    
    await waitFor(() => {
      expect(screen.getByText('Seller Information')).toBeInTheDocument();
      expect(screen.getByText('Tech Store')).toBeInTheDocument();
      expect(screen.getByText('Rating: 4.5/5')).toBeInTheDocument();
    });
  });

  it('validates feedback input in review dialog', async () => {
    renderWithRouter(<ProductApprovals />);
    const reviewButton = screen.getAllByText('Review')[0];
    fireEvent.click(reviewButton);
    
    const feedbackInput = screen.getByPlaceholderText('Enter feedback for the seller (optional)');
    fireEvent.change(feedbackInput, { target: { value: 'a'.repeat(1000) } });
    
    expect(feedbackInput).toHaveValue('a'.repeat(1000));
  });

  it('displays correct listing type badge', () => {
    renderWithRouter(<ProductApprovals />);
    const featuredBadge = screen.getByText('featured');
    const standardBadge = screen.getByText('standard');
    
    expect(featuredBadge).toHaveClass('bg-primary');
    expect(standardBadge).toHaveClass('bg-secondary');
  });

  it('formats dates correctly', () => {
    renderWithRouter(<ProductApprovals />);
    const submittedDate = screen.getByText(/February 20, 2024/);
    expect(submittedDate).toBeInTheDocument();
  });
});