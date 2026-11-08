import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AddOffer from './AddOffer'

describe('AddOffer', () => {
  it('renders the navigation with My Offers active', () => {
    render(<AddOffer />)
    expect(screen.getByRole('link', { name: 'My Offers' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the page heading and instructions', () => {
    render(<AddOffer />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Add Job Offer' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/enter the details you have/i),
    ).toBeInTheDocument()
  })

  it('renders the offer form', () => {
    render(<AddOffer />)
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save offer/i }),
    ).toBeInTheDocument()
  })
})
