import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductApprovals from '@/pages/ProductApprovals';

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductApprovals - Rendering', () => {
  it('renders the product approvals page with title', () => {
    renderWithRouter(<ProductApprovals />);
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
  });

  it('displays pending products in a grid', () => {
    renderWithRouter(<ProductApprovals />);
    const productCards = screen.getAllByRole('article');
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('shows product details including title, price, and seller information', () => {
    renderWithRouter(<ProductApprovals />);
    expect(screen.getByText('iPhone 13 Pro')).toBeInTheDocument();
    expect(screen.getByText('Tech Store')).toBeInTheDocument();
    expect(screen.getByText('XAF 750,000')).toBeInTheDocument();
  });

  it('displays correct listing type badge', () => {
    renderWithRouter(<ProductApprovals />);
    const featuredBadge = screen.getByText('featured');
    const standardBadge = screen.getByText('standard');
    
    expect(featuredBadge).toHaveClass('bg-primary');
    expect(standardBadge).toHaveClass('bg-secondary');
  });

  it('formats dates correctly', () => {
    renderWithRouter(<ProductApprovals />);
    const submittedDate = screen.getByText(/February 20, 2024/);
    expect(submittedDate).toBeInTheDocument();
  });
});