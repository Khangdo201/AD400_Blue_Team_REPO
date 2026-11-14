import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NavBar from './NavBar'

describe('NavBar', () => {
  it('shows the CareerCompare brand', () => {
    render(<NavBar />)
    expect(screen.getByText('CareerCompare')).toBeInTheDocument()
  })

  it('renders the main navigation links', () => {
    render(<NavBar />)
    const nav = screen.getByRole('navigation', { name: /main/i })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      'Dashboard',
      'My Offers',
      'My Priorities',
    ])
  })

  it('marks Dashboard as the current page by default', () => {
    render(<NavBar />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'My Offers' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('marks the provided active page as current', () => {
    render(<NavBar activePage="My Offers" />)
    expect(screen.getByRole('link', { name: 'My Offers' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute(
      'aria-current',
    )
  })
})
