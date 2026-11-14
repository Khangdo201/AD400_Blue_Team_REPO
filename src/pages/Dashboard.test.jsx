import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  it('renders the navigation with Dashboard active', () => {
    render(<Dashboard />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('renders the hero heading', () => {
    render(<Dashboard />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /compare your offers/i,
    )
  })

  it('renders the "Everything you need to decide" section', () => {
    render(<Dashboard />)
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Everything you need to decide',
      }),
    ).toBeInTheDocument()
  })

  it('renders the three steps in order', () => {
    render(<Dashboard />)
    const list = screen.getByRole('list', { name: /steps/i })
    const items = within(list).getAllByRole('listitem')

    expect(items).toHaveLength(3)
    expect(
      items.map((item) => within(item).getByRole('heading').textContent),
    ).toEqual(['Add Offer', 'View My Offers', 'Set Priorities'])
    expect(within(items[0]).getByText('Enter compensation and benefits.')).toBeInTheDocument()
    expect(within(items[1]).getByText('Review and manage saved offers.')).toBeInTheDocument()
    expect(within(items[2]).getByText('Choose what matters most to you.')).toBeInTheDocument()
  })

  it('forwards Add Job Offer clicks to onAddOffer', async () => {
    const user = userEvent.setup()
    const onAddOffer = vi.fn()
    render(<Dashboard onAddOffer={onAddOffer} />)

    await user.click(screen.getByRole('button', { name: /add job offer/i }))

    expect(onAddOffer).toHaveBeenCalledTimes(1)
  })
})
