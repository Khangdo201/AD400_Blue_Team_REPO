import './NavBar.css'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'My Offers', href: '#offers' },
  { label: 'My Priorities', href: '#priorities' },
]

export default function NavBar({ activePage = 'Dashboard' }) {
  return (
    <header className="navbar">
      <a className="navbar__brand" href="#dashboard">
        CareerCompare
      </a>
      <nav aria-label="Main">
        <ul className="navbar__links">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={label}>
              <a
                className="navbar__link"
                href={href}
                aria-current={label === activePage ? 'page' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
