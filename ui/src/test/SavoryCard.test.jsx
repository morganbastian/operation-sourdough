import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SavoryCard from '../views/Home/SavoryCard'
import api from '../utility/api'
describe('SavoryCard Component', () => {
  it('renders the product data correctly', async () => {
    const mockProductData = [
      {
        product_id: 1,
        name: 'Savory Product 1',
        description: 'This is the description for Savory Product 1',
        price: 10.99,
        product_type: 'savory'
      },
      {
        product_id: 2,
        name: 'Savory Product 2',
        description: 'This is the description for Savory Product 2',
        price: 12.99,
        product_type: 'savory'
      }
    ];

    // Use vi.spyOn for mocking
    vi.spyOn(api, 'get').mockResolvedValue({ data: mockProductData });

    render(<SavoryCard />);

    // Use findByText for asynchronous elements
    expect(await screen.findByText('Savory Product 1')).toBeInTheDocument();
    expect(await screen.findByText('This is the description for Savory Product 1')).toBeInTheDocument();
    expect(await screen.findByText('10.99')).toBeInTheDocument();

    expect(await screen.findByText('Savory Product 2')).toBeInTheDocument();
    expect(await screen.findByText('This is the description for Savory Product 2')).toBeInTheDocument();
    expect(await screen.findByText('12.99')).toBeInTheDocument();
  });

  it('handles error when fetching product data', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Failed to fetch product data'));

    render(<SavoryCard />);

    expect(await screen.findByText('Error fetching product data: Failed to fetch product data')).toBeInTheDocument();
  });
});