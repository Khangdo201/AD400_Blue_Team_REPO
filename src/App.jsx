import { useState } from 'react'
import AddOffer from './pages/AddOffer'
import Dashboard from './pages/Dashboard'
import MyOffers from './pages/MyOffers'
import { mockOffers } from './test/mockOffers'

const SAVED_OFFERS = mockOffers.map((mock) => mock.expected)

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [offers, setOffers] = useState([])

  const saveOffer = (offer) => {
    setOffers((current) => [...current, offer])
    setPage('dashboard')
  }

  if (page === 'add-offer') {
    return (
      <AddOffer onSave={saveOffer} onCancel={() => setPage('dashboard')} />
    )
  }

  return <Dashboard onAddOffer={() => setPage('add-offer')} offers={offers} />
  const [offers] = useState(SAVED_OFFERS)
  const [, setSelectedOffer] = useState(null)

  if (page === 'offers') {
    return (
      <MyOffers
        offers={offers}
        onNavigate={setPage}
        // The offer details view is being built on another branch; once
        // it merges, render it here for the selected offer.
        onSelectOffer={setSelectedOffer}
      />
    )
  }

  return <Dashboard onNavigate={setPage} />
}
