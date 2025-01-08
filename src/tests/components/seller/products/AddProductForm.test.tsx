import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddProductForm } from '@/components/seller/products/AddProductForm';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  },
}));

describe('AddProductForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful auth session by default
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user-id', email: 'test@example.com' }
        }
      },
      error: null
    });
    
    // Mock successful profile fetch with seller role
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { role: 'seller' },
            error: null
          })
        })
      })
    } as any);
  });

  const renderForm = () => {
    return render(
      <BrowserRouter>
        <AddProductForm />
      </BrowserRouter>
    );
  };

  describe('Authentication', () => {
    it('shows error when user is not logged in', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
        data: { session: null },
        error: null
      });

      renderForm();
      
      await waitFor(() => {
        expect(screen.getByText('You must be logged in to add a product')).toBeInTheDocument();
      });
    });

    it('shows error when user is not a seller', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { role: 'buyer' },
              error: null
            })
          })
        })
      } as any);

      renderForm();
      
      await waitFor(() => {
        expect(screen.getByText('Only sellers can add products')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('validates required fields', async () => {
      renderForm();
      
      const submitButton = screen.getByRole('button', { name: /create ad/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
        expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
        expect(screen.getByText('Please select a category')).toBeInTheDocument();
        expect(screen.getByText('At least one image is required')).toBeInTheDocument();
      });
    });
  });

  describe('Image Upload', () => {
    it('handles successful image upload', async () => {
      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'test-url' } })
      } as any);

      renderForm();
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByTestId('image-upload');
      
      await user.upload(input, file);
      
      await waitFor(() => {
        expect(supabase.storage.from).toHaveBeenCalledWith('product-images');
      });
    });

    it('handles image upload errors', async () => {
      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: vi.fn().mockRejectedValue(new Error('Upload failed')),
      } as any);

      renderForm();
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByTestId('image-upload');
      
      await user.upload(input, file);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to upload test.jpg');
      });
    });
  });

  describe('Form Submission', () => {
    it('successfully submits form with valid data', async () => {
      renderForm();
      
      // Fill form with valid data
      await user.type(screen.getByLabelText(/title/i), 'Test Product');
      await user.type(screen.getByLabelText(/description/i), 'Test Description of the product');
      await user.type(screen.getByLabelText(/price/i), '1000');
      
      // Mock successful image upload
      vi.mocked(supabase.storage.from).mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'test-url' } })
      } as any);
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByTestId('image-upload');
      await user.upload(input, file);

      const submitButton = screen.getByRole('button', { name: /create ad/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Product submitted for approval!');
      });
    });
  });
});