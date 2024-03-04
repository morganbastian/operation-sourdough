import Home from '../views/Home'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('NotFound component', () => {
	it('renders Operation Sourdough text', () => {
		render(<Home />)
		expect(screen.getByText('Operation Sourdough')).toBeInTheDocument()
	})
	it('renders About Me text', () => {
		render(<Home />)
		expect(screen.getByText('About Me')).toBeInTheDocument();
  });
	it('renders About Me description', () => {
		render(<Home />)
		expect(screen.getByText('Hi! My name is Lillian Hsu. I am a third year surgery resident at MUSC who has recently discovered her passion for all things sourdough!')).toBeInTheDocument();
  });
	it('render Savory text', () => {
		render(<Home />)
		expect(screen.getByText('Savory')).toBeInTheDocument();
  });
	it('render Sweet text', () => {
		render(<Home />)
		expect(screen.getByText('Sweet')).toBeInTheDocument();
  });
	it('render Button', () => {
		render(<Home />)
		expect(screen.getByText('Checkout')).toBeInTheDocument();
  });
	
})
