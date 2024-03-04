// Import the necessary testing utilities from Vitest and React Testing Library
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Import the component you wish to test
import Home from '../views/Home/index'; // Adjust the import path as necessary

// Describe the group of tests
describe('Home component', () => {
  // Define a single test
  it('renders the correct content', () => {
    // Render the Home component
    render(<Home />);
    
    // Assert that the expected content is part of the document
    expect(screen.getByText('Operation Sourdough')).toBeInTheDocument();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Hi! My name is Lillian Hsu. I am a third year surgery resident at MUSC who has recently discovered her passion for all things sourdough!')).toBeInTheDocument();
    expect(screen.getByText('Savory')).toBeInTheDocument();
    expect(screen.getByText('Sweet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
  });
});