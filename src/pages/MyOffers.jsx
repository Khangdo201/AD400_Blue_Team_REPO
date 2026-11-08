import NavBar from '../components/NavBar'
import './MyOffers.css'

const formatSalary = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export default function MyOffers({
  offers = [],
  onNavigate,
  onSelectOffer,
  onAddOffer,
}) {
  return (
    <>
      <NavBar activePage="My Offers" onNavigate={onNavigate} />
      <main className="my-offers">
        <div className="my-offers__header">
          <div>
            <h1 className="my-offers__title">My Job Offers</h1>
            <p className="my-offers__subtitle">
              Select an offer to review its details.
            </p>
          </div>
          {onAddOffer && (
            <button
              type="button"
              className="my-offers__add"
              onClick={onAddOffer}
            >
              + Add Offer
            </button>
          )}
        </div>
        {offers.length === 0 ? (
          <p className="my-offers__empty">
            You haven&apos;t saved any offers yet — add one to get started.
          </p>
        ) : (
          <ul className="my-offers__list" aria-label="Saved offers">
            {offers.map((offer) => (
              <li key={offer.companyName} className="my-offers__item">
                <button
                  type="button"
                  className="my-offers__offer"
                  onClick={() => onSelectOffer?.(offer)}
                >
                  <span className="my-offers__company">{offer.companyName}</span>
                  <span className="my-offers__job">{offer.jobTitle}</span>
                  <span className="my-offers__salary">
                    {formatSalary(offer.salary)}
                  </span>
                  <span className="my-offers__salary-label">Annual salary</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
