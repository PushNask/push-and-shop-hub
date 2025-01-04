import { render, screen, fireEvent } from '@testing-library/react';
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

describe('ProductApprovals - Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});