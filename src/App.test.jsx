import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the dashboard by default', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /everything you need to decide/i }),
    ).toBeInTheDocument()
  })

  it('lists saved offers after navigating to My Offers', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'My Offers' }))

    expect(
      screen.getByRole('heading', { level: 1, name: 'My Job Offers' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Tech Startup')).toBeInTheDocument()
    expect(screen.getByText('Established Corporation')).toBeInTheDocument()
  })

  it('returns to the dashboard from My Offers', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'My Offers' }))
    await user.click(screen.getByRole('link', { name: 'Dashboard' }))

    expect(
      screen.getByRole('heading', { name: /everything you need to decide/i }),
    ).toBeInTheDocument()
  })
})
