import Home from '../views/Home'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('NotFound component', () => {
	it('renders Operation Sourdough text', () => {
		render(<Home />)
		expect(screen.getByText('Operation Sourdough')).toBeInTheDocument()
	})
})
