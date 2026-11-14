import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  establishedCorpOffer,
  techStartupOffer,
} from '../test/mockOffers'
import MyOffers from './MyOffers'

const OFFERS = [techStartupOffer, establishedCorpOffer]

describe('MyOffers', () => {
  it('renders the navigation with My Offers active', () => {
    render(<MyOffers offers={OFFERS} />)
    expect(screen.getByRole('link', { name: 'My Offers' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('lists each saved offer with its company name', () => {
    render(<MyOffers offers={OFFERS} />)
    const list = screen.getByRole('list', { name: /saved offers/i })
    const items = within(list).getAllByRole('listitem')

    expect(items).toHaveLength(2)
    expect(
      items.map(
        (item) =>
          within(item).getByRole('button').querySelector('.my-offers__company')
            .textContent,
      ),
    ).toEqual(['Tech Startup', 'Established Corporation'])
    expect(within(items[0]).getByText('$120,000')).toBeInTheDocument()
    expect(within(items[1]).getByText('$135,000')).toBeInTheDocument()
  })

  it('calls onSelectOffer with the clicked offer', async () => {
    const user = userEvent.setup()
    const onSelectOffer = vi.fn()
    render(<MyOffers offers={OFFERS} onSelectOffer={onSelectOffer} />)

    await user.click(
      screen.getByRole('button', { name: /established corporation/i }),
    )

    expect(onSelectOffer).toHaveBeenCalledTimes(1)
    expect(onSelectOffer).toHaveBeenCalledWith(establishedCorpOffer)
  })

  it('tells the user to add an offer when none are saved', () => {
    render(<MyOffers offers={[]} />)

    expect(
      screen.getByText(/haven't saved any offers yet/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/add one to get started/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('list', { name: /saved offers/i }),
    ).not.toBeInTheDocument()
  })

  it('forwards Add Offer clicks to onAddOffer', async () => {
    const user = userEvent.setup()
    const onAddOffer = vi.fn()
    render(<MyOffers offers={OFFERS} onAddOffer={onAddOffer} />)

    await user.click(screen.getByRole('button', { name: /add offer/i }))

    expect(onAddOffer).toHaveBeenCalledTimes(1)
  })
})
