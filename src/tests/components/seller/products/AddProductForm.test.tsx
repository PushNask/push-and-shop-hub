import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
      getUser: vi.fn(),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('AddProductForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = () => {
    return render(
      <BrowserRouter>
        <AddProductForm />
      </BrowserRouter>
    );
  };

  describe('1.1 Product Information', () => {
    it('validates title field', async () => {
      renderForm();
      const titleInput = screen.getByLabelText(/title/i);
      
      // Test empty title
      await user.click(screen.getByRole('button', { name: /add product/i }));
      expect(await screen.findByText('Title must be at least 3 characters')).toBeInTheDocument();
      
      // Test valid title
      await user.type(titleInput, 'iPhone 13 Pro Max 256GB');
      expect(screen.queryByText('Title must be at least 3 characters')).not.toBeInTheDocument();
    });

    it('validates description field', async () => {
      renderForm();
      const descriptionInput = screen.getByLabelText(/description/i);
      
      // Test empty description
      await user.click(screen.getByRole('button', { name: /add product/i }));
      expect(await screen.findByText('Description must be at least 10 characters')).toBeInTheDocument();
      
      // Test valid description
      await user.type(descriptionInput, 'Brand new iPhone 13 Pro Max in Space Gray, 256GB storage, unlocked.');
      expect(screen.queryByText('Description must be at least 10 characters')).not.toBeInTheDocument();
    });

    it('validates price field', async () => {
      renderForm();
      const priceInput = screen.getByLabelText(/price/i);
      
      // Test invalid price
      await user.type(priceInput, '-1000');
      await user.click(screen.getByRole('button', { name: /add product/i }));
      expect(await screen.findByText('Price must be a valid number greater than 0')).toBeInTheDocument();
      
      // Test valid price
      await user.clear(priceInput);
      await user.type(priceInput, '750000');
      expect(screen.queryByText('Price must be a valid number greater than 0')).not.toBeInTheDocument();
    });
  });

  describe('1.2 Product Images', () => {
    it('handles image upload within limits', async () => {
      renderForm();
      const input = screen.getByTestId('image-upload');
      
      // Create test files
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      
      // Test valid file upload
      await user.upload(input, validFile);
      expect(screen.getByAltText('Preview 1')).toBeInTheDocument();
      
      // Test file size limit
      await user.upload(input, largeFile);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('2MB'));
    });

    it('enforces maximum image limit', async () => {
      renderForm();
      const input = screen.getByTestId('image-upload');
      const files = Array(8).fill(new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
      
      await user.upload(input, files);
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Maximum 7 images allowed'));
    });
  });

  describe('1.3 Delivery Options', () => {
    it('validates delivery options selection', async () => {
      renderForm();
      
      // Test no selection
      await user.click(screen.getByRole('button', { name: /add product/i }));
      expect(await screen.findByText('Select at least one delivery option')).toBeInTheDocument();
      
      // Test valid selection
      await user.click(screen.getByLabelText(/pickup available/i));
      expect(screen.queryByText('Select at least one delivery option')).not.toBeInTheDocument();
    });
  });

  describe('1.4 Payment Method', () => {
    it('validates payment method selection', async () => {
      renderForm();
      
      // Test valid selection
      await user.click(screen.getByLabelText(/cash payment/i));
      expect(screen.getByLabelText(/cash payment/i)).toBeChecked();
    });
  });

  describe('1.5 Form Submission', () => {
    it('submits form with valid data', async () => {
      renderForm();
      
      // Fill in valid data
      await user.type(screen.getByLabelText(/title/i), 'iPhone 13 Pro Max 256GB');
      await user.type(screen.getByLabelText(/description/i), 'Brand new iPhone 13 Pro Max');
      await user.type(screen.getByLabelText(/price/i), '750000');
      await user.click(screen.getByLabelText(/pickup available/i));
      await user.click(screen.getByLabelText(/cash payment/i));
      
      // Upload test image
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(screen.getByTestId('image-upload'), file);
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /add product/i }));
      
      // Verify submission
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Product submitted for approval!');
      });
    });
  });
});