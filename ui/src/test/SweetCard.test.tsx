// SavoryCard.test.tsx
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SweetCard from '../views/Home/SweetCard';

describe('SweetCard', () => {
  const mockProduct = {
    product_id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    product_type: 'sweet',
  };

  const mockAddOns = [
    { add_on_id: 1, name: 'Add-On 1', price: 10 },
    { add_on_id: 2, name: 'Add-On 2', price: 20 },
  ];

  it('renders product details correctly', () => {
    render(<SweetCard product={mockProduct} addOns={[]} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Price: $100')).toBeInTheDocument();
  });

  it('renders product with add-ons correctly', () => {
    render(<SweetCard product={mockProduct} addOns={mockAddOns} />);

    expect(screen.getByText('Add-Ons:')).toBeInTheDocument();
    expect(screen.getByText('Add-On 1 - $10')).toBeInTheDocument();
    expect(screen.getByText('Add-On 2 - $20')).toBeInTheDocument();
  });

  it('does not render add-ons section when there are no add-ons', () => {
    const { queryByText } = render(<SweetCard product={mockProduct} addOns={[]} />);
    expect(queryByText('Add-Ons:')).not.toBeInTheDocument();
  });
});