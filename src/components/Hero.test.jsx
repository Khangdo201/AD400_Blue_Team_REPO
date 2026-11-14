import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('shows the eyebrow label', () => {
    render(<Hero />)
    expect(screen.getByText(/your next chapter/i)).toBeInTheDocument()
  })

  it('shows the main heading', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /compare your offers\. choose your next step\./i,
      }),
    ).toBeInTheDocument()
  })

  it('shows the supporting copy', () => {
    render(<Hero />)
    expect(
      screen.getByText(
        'Review salary, benefits, and career opportunities in one place.',
      ),
    ).toBeInTheDocument()
  })

  it('calls onAddOffer when the Add Job Offer button is clicked', async () => {
    const user = userEvent.setup()
    const onAddOffer = vi.fn()
    render(<Hero onAddOffer={onAddOffer} />)

    await user.click(screen.getByRole('button', { name: /add job offer/i }))

    expect(onAddOffer).toHaveBeenCalledTimes(1)
  })
})
