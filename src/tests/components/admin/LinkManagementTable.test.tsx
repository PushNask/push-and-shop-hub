import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import type { Product } from '@/types/product';
import { LinkManagementTable } from '@/components/admin/LinkManagementTable';

const mockProduct: Product = {
  id: '1',
  seller_id: '123',
  title: 'iPhone 13 Pro',
  description: 'A great phone',
  price: 750000,
  currency: 'XAF',
  category: 'Electronics',
  status: 'pending',
  expiry: '2024-12-31',
  link_slot: 1,
  images: [],
  delivery_option: 'pickup',
  seller: {
    email: 'seller@example.com',
    country: 'Cameroon',
    phone: '+237123456789',
    name: 'Tech Store',
    location: 'Cameroon',
    rating: 4.5,
    joinedDate: '2024-01-01'
  }
};

describe('LinkManagementTable', () => {
  const onAssignProduct = vi.fn();

  it('renders the table with correct headers', () => {
    render(
      <BrowserRouter>
        <LinkManagementTable 
          linkSlots={[mockProduct]} 
          onAssignProduct={onAssignProduct}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Slot')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Current Product')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('displays product information correctly', () => {
    render(
      <BrowserRouter>
        <LinkManagementTable 
          linkSlots={[mockProduct]} 
          onAssignProduct={onAssignProduct}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('iPhone 13 Pro')).toBeInTheDocument();
    expect(screen.getByText('P1')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('shows empty slots when no products', () => {
    render(
      <BrowserRouter>
        <LinkManagementTable 
          linkSlots={[]} 
          onAssignProduct={onAssignProduct}
        />
      </BrowserRouter>
    );
    expect(screen.getAllByText('Available').length).toBeGreaterThan(0);
  });

  it('shows featured badge for first 12 slots', () => {
    render(
      <BrowserRouter>
        <LinkManagementTable 
          linkSlots={[mockProduct]} 
          onAssignProduct={onAssignProduct}
        />
      </BrowserRouter>
    );
    const featuredBadges = screen.getAllByText('Featured');
    expect(featuredBadges.length).toBe(12);
  });
});