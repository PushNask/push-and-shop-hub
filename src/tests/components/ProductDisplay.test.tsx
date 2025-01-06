import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductDisplay } from '@/components/ProductDisplay';
import { BrowserRouter } from 'react-router-dom';
import type { Product } from '@/types/product';

const mockProduct: Product = {
  id: '1',
  seller_id: '123',
  title: 'Test Product 1',
  price: 100,
  currency: 'XAF',
  description: 'Test description 1',
  category: 'Electronics',
  images: ['test1.jpg'],
  status: 'approved',
  expiry: new Date(Date.now() + 86400000).toISOString(),
  link_slot: 13,
  delivery_option: 'pickup',
  listingType: 'standard',
  profiles: {
    email: 'seller1@test.com',
    country: 'Cameroon',
    phone: '+237123456789'
  }
};

const mockProducts = [mockProduct];

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductDisplay Component', () => {
  it('renders loading skeleton when isLoading is true', () => {
    renderWithRouter(<ProductDisplay products={[]} isLoading={true} />);
    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when no products are available', () => {
    renderWithRouter(<ProductDisplay products={[]} isLoading={false} />);
    expect(screen.getByText(/No products found/i)).toBeInTheDocument();
  });

  it('renders product list when products are available', () => {
    renderWithRouter(<ProductDisplay products={mockProducts} isLoading={false} />);
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
  });

  it('displays product details correctly', () => {
    renderWithRouter(<ProductDisplay products={mockProducts} isLoading={false} />);
    expect(screen.getByText('XAF 100')).toBeInTheDocument();
    expect(screen.getByText('Cameroon')).toBeInTheDocument();
  });

  it('shows delivery options', () => {
    renderWithRouter(<ProductDisplay products={mockProducts} isLoading={false} />);
    expect(screen.getByText(/Pickup/i)).toBeInTheDocument();
  });

  it('handles view mode switching', () => {
    renderWithRouter(<ProductDisplay products={mockProducts} isLoading={false} />);
    const gridButton = screen.getByRole('button', { name: /grid view/i });
    const listButton = screen.getByRole('button', { name: /list view/i });
    
    fireEvent.click(listButton);
    expect(screen.getByTestId('product-list')).toHaveClass('grid-cols-1');
    
    fireEvent.click(gridButton);
    expect(screen.getByTestId('product-list')).toHaveClass('grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
  });

  it('handles pagination correctly', () => {
    const manyProducts = Array(15).fill(null).map((_, index) => ({
      ...mockProducts[0],
      id: String(index + 1),
      title: `Test Product ${index + 1 }`
    }));

    renderWithRouter(<ProductDisplay products={manyProducts} isLoading={false} />);
    const nextPageButton = screen.getByRole('button', { name: /next/i });
    
    fireEvent.click(nextPageButton);
    expect(screen.getByText('Test Product 13')).toBeInTheDocument();
  });

  it('filters products by category', () => {
    renderWithRouter(<ProductDisplay products={mockProducts} isLoading={false} />);
    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    
    fireEvent.change(categorySelect, { target: { value: 'Electronics' } });
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
  });

  it('sorts products correctly', () => {
    renderWithRouter(<ProductDisplay products={mockProducts} isLoading={false} />);
    const sortSelect = screen.getByRole('combobox', { name: /sort by/i });
    
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
  });

  it('handles search functionality', () => {
    renderWithRouter(<ProductDisplay products={mockProducts} isLoading={false} />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    
    fireEvent.change(searchInput, { target: { value: 'Test Product 1' } });
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
  });
});
