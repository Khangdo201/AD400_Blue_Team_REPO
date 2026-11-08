import { useState } from 'react'
import AddOffer from './pages/AddOffer'
import Dashboard from './pages/Dashboard'

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
}
