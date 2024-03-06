import NotFound from '../views/NotFound/index'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('NotFound component', () => {
	it('renders "Not Found" text', () => {
		render(<NotFound />)
		expect(screen.getByText('Not Found')).toBeInTheDocument()
	})
})
