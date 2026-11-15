import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

async function fillRequiredFields(user) {
  await user.type(screen.getByLabelText(/company name/i), 'Company A')
  await user.type(screen.getByLabelText(/job title/i), 'Junior Developer')
  await user.type(screen.getByLabelText(/annual salary/i), '85000')
}

describe('App', () => {
  it('renders the dashboard by default', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /everything you need to decide/i }),
    ).toBeInTheDocument()
  })

  it('shows the add offer page when Add Job Offer is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /add job offer/i }))

    expect(
      screen.getByRole('heading', { level: 1, name: 'Add Job Offer' }),
    ).toBeInTheDocument()
  })

  it('returns to the dashboard after saving an offer', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /add job offer/i }))
    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /save offer/i }))

    // TODO: once a My Offers page exists, saving should navigate there
    // instead of the dashboard — update saveOffer in App.jsx and assert
    // the offers list renders the newly saved offer.
    expect(
      screen.getByRole('heading', { name: /everything you need to decide/i }),
    ).toBeInTheDocument()
  })

  it('returns to the dashboard when the form is cancelled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /add job offer/i }))
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(
      screen.getByRole('heading', { name: /everything you need to decide/i }),
    ).toBeInTheDocument()
  })
})
