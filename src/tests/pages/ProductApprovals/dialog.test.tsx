import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductApprovals from '@/pages/ProductApprovals';
import { toast } from 'sonner';
import { vi } from 'vitest';

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductApprovals - Dialog Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens review dialog when clicking Review button', async () => {
    renderWithRouter(<ProductApprovals />);
    const reviewButton = screen.getAllByText('Review')[0];
    fireEvent.click(reviewButton);
    
    await waitFor(() => {
      expect(screen.getByText('Review Product Listing')).toBeInTheDocument();
    });
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
});