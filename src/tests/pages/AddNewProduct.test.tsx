import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
      from: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('AddNewProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock authenticated user with complete User type
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

  it('handles image upload', async () => {
    render(
      <BrowserRouter>
        <AddNewProduct />
      </BrowserRouter>
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('image-upload') as HTMLInputElement;

    await userEvent.upload(input, file);

    expect(input.files).toHaveLength(1);
    expect(input.files?.[0]).toBe(file);
  });

  it('enforces maximum image limit', async () => {
    render(
      <BrowserRouter>
        <AddNewProduct />
      </BrowserRouter>
    );

    const files = Array(8).fill(null).map((_, i) => 
      new File(['test'], `test${i}.png`, { type: 'image/png' })
    );
    const input = screen.getByTestId('image-upload') as HTMLInputElement;

    await userEvent.upload(input, files);

    expect(toast.error).toHaveBeenCalledWith('Maximum 7 images allowed');
  });

  it('handles delivery options selection', async () => {
    render(
      <BrowserRouter>
        <AddNewProduct />
      </BrowserRouter>
    );

    const pickupCheckbox = screen.getByLabelText('Pickup Available');
    const shippingCheckbox = screen.getByLabelText('Shipping Available');
    const bothCheckbox = screen.getByLabelText('Both Options Available');

    await userEvent.click(bothCheckbox);
    expect(bothCheckbox).toBeChecked();
    expect(pickupCheckbox).not.toBeChecked();
    expect(shippingCheckbox).not.toBeChecked();

    await userEvent.click(bothCheckbox);
    await userEvent.click(pickupCheckbox);
    expect(pickupCheckbox).toBeChecked();
    expect(bothCheckbox).not.toBeChecked();
  });

  // Add more test cases as needed
});