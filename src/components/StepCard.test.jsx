import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StepCard from './StepCard'

describe('StepCard', () => {
  it('renders the step number, title, and description', () => {
    render(
      <StepCard
        step={1}
        title="Add Offer"
        description="Enter compensation and benefits."
      />,
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Add Offer' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Enter compensation and benefits.'),
    ).toBeInTheDocument()
  })

  it('renders as a list item so cards form an ordered list', () => {
    render(
      <ol>
        <StepCard step={2} title="View My Offers" description="Review." />
      </ol>,
    )
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })
})
