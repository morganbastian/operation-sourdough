// Import the necessary testing utilities from Vitest and React Testing Library
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Import the component you wish to test
import NotFound from '../views/NotFound/index'; // Adjust the import path as necessary

// Describe the group of tests
describe('NotFound component', () => {
  // Define a single test
  it('renders "Not Found" text', () => {
    // Render the NotFound component
    render(<NotFound />);
    
    // Assert that the expected text is part of the document
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });
});
