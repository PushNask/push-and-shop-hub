import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminList } from '@/components/admin/AdminList';
import { vi } from 'vitest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('AdminList', () => {
  const mockOnRemoveAdmin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AdminList onRemoveAdmin={mockOnRemoveAdmin} />
      </QueryClientProvider>
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays admin users when data is loaded', async () => {
    const mockAdmins = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        region: 'cm-center',
        is_verified: true,
      },
    ];

    vi.mock('@/integrations/supabase/client', () => ({
      supabase: {
        from: () => ({
          select: () => ({
            eq: () => Promise.resolve({ data: mockAdmins, error: null }),
          }),
        }),
      },
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <AdminList onRemoveAdmin={mockOnRemoveAdmin} />
      </QueryClientProvider>
    );

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onRemoveAdmin when remove button is clicked', async () => {
    const mockAdmins = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        region: 'cm-center',
        is_verified: true,
      },
    ];

    vi.mock('@/integrations/supabase/client', () => ({
      supabase: {
        from: () => ({
          select: () => ({
            eq: () => Promise.resolve({ data: mockAdmins, error: null }),
          }),
        }),
      },
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <AdminList onRemoveAdmin={mockOnRemoveAdmin} />
      </QueryClientProvider>
    );

    const removeButton = await screen.findByRole('button');
    fireEvent.click(removeButton);

    expect(mockOnRemoveAdmin).toHaveBeenCalledWith('1');
  });

  it('shows error message when data fetch fails', async () => {
    vi.mock('@/integrations/supabase/client', () => ({
      supabase: {
        from: () => ({
          select: () => ({
            eq: () => Promise.resolve({ data: null, error: new Error('Failed to fetch') }),
          }),
        }),
      },
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <AdminList onRemoveAdmin={mockOnRemoveAdmin} />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Failed to fetch admin users')).toBeInTheDocument();
  });
});