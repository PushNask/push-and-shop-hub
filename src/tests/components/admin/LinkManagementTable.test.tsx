import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Product } from '@/types/product';
import { LinkManagementTable } from '@/pages/LinkManagement/LinkManagementTable';

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
  listingType: 'featured',
  seller: {
    email: 'seller@example.com',
    country: 'Cameroon',
    phone: '+237123456789'
  }
};

describe('LinkManagementTable', () => {
  it('renders the table with correct headers', () => {
    render(
      <BrowserRouter>
        <LinkManagementTable products={[mockProduct]} />
      </BrowserRouter>
    );
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Link Slot')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Expiry')).toBeInTheDocument();
  });

  it('displays product information correctly', () => {
    render(
      <BrowserRouter>
        <LinkManagementTable products={[mockProduct]} />
      </BrowserRouter>
    );
    expect(screen.getByText('iPhone 13 Pro')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
  });

  it('shows empty state when no products', () => {
    render(
      <BrowserRouter>
        <LinkManagementTable products={[]} />
      </BrowserRouter>
    );
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(
      <BrowserRouter>
        <LinkManagementTable products={[mockProduct]} />
      </BrowserRouter>
    );
    const formattedDate = screen.getByText('Dec 31, 2024');
    expect(formattedDate).toBeInTheDocument();
  });
});