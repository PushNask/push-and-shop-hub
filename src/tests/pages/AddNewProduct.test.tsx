import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'sonner';
import AddNewProduct from '@/pages/AddNewProduct';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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

describe('AddNewProduct', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: '2024-01-01',
        } as User,
      },
      error: null,
    });
  });

  it('renders all form sections', () => {
    render(
      <BrowserRouter>
        <AddNewProduct />
      </BrowserRouter>
    );

    expect(screen.getByText('Add New Product')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Price (XAF)')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Product Images')).toBeInTheDocument();
    expect(screen.getByText('Delivery Options')).toBeInTheDocument();
    expect(screen.getByText('Listing Type')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(
      <BrowserRouter>
        <AddNewProduct />
      </BrowserRouter>
    );

    // Fill in form fields
    await user.type(screen.getByLabelText('Title'), 'Test Product');
    await user.type(screen.getByLabelText('Description'), 'Test Description of the product');
    await user.type(screen.getByLabelText('Price (XAF)'), '1000');
    
    // Upload test image
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('image-upload') as HTMLInputElement;
    await user.upload(input, file);

    // Select delivery option
    await user.click(screen.getByLabelText('Pickup Available'));

    // Submit form
    await user.click(screen.getByRole('button', { name: /add product/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Product submitted for approval!');
    });
  });

  it('validates file size and type', async () => {
    render(
      <BrowserRouter>
        <AddNewProduct />
      </BrowserRouter>
    );

    const largeFile = new File(['test'.repeat(1024 * 1024 * 6)], 'large.png', { type: 'image/png' });
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    const input = screen.getByTestId('image-upload') as HTMLInputElement;
    
    await user.upload(input, largeFile);
    expect(screen.getByText('Each file must be less than 5MB')).toBeInTheDocument();

    await user.upload(input, invalidFile);
    expect(screen.getByText('Only .jpg, .jpeg, .png and .webp formats are supported')).toBeInTheDocument();
  });

  it('handles delivery options correctly', async () => {
    render(
      <BrowserRouter>
        <AddNewProduct />
      </BrowserRouter>
    );

    const pickupCheckbox = screen.getByLabelText('Pickup Available');
    const shippingCheckbox = screen.getByLabelText('Shipping Available');
    const bothCheckbox = screen.getByLabelText('Both Options Available');

    await user.click(bothCheckbox);
    expect(bothCheckbox).toBeChecked();
    expect(pickupCheckbox).not.toBeChecked();
    expect(shippingCheckbox).not.toBeChecked();

    await user.click(bothCheckbox);
    await user.click(pickupCheckbox);
    expect(pickupCheckbox).toBeChecked();
    expect(bothCheckbox).not.toBeChecked();
  });
});