
import { useState } from 'react'
import AddOffer from './pages/AddOffer'
import Dashboard from './pages/Dashboard'
import MyOffers from './pages/MyOffers'
import { mockOffers } from './test/mockOffers'

const SAVED_OFFERS = mockOffers.map((mock, index) => ({
  ...mock.expected,
  id: index + 1,
}))

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [offers, setOffers] = useState(SAVED_OFFERS)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [addingOffer, setAddingOffer] = useState(false)

  function navigate(nextPage) {
    setPage(nextPage)
    setSelectedOffer(null)
    setAddingOffer(false)
  }

  function addOffer() {
    setPage('add-offer')
  }

  function saveNewOffer(offer) {
    setOffers((previous) => [
      ...previous,
      { ...offer, id: crypto.randomUUID() },
    ])
    navigate('offers')
  }

  function saveOffer(offer) {
    if (offer.id != null) {
      setOffers((previous) =>
        previous.map((item) =>
          item.id === offer.id ? offer : item
        )
      )
    } else {
      setOffers((previous) => [
        ...previous,
        { ...offer, id: crypto.randomUUID() },
      ])
    }

    setSelectedOffer(null)
    setAddingOffer(false)
  }

  function deleteOffer(id) {
    setOffers((previous) =>
      previous.filter((offer) => offer.id !== id)
    )
    setSelectedOffer(null)
  }

  if (page === 'add-offer') {
    return (
      <AddOffer
        onSave={saveNewOffer}
        onCancel={() => navigate('dashboard')}
      />
    )
  }

  if (page === 'offers') {
    return (
      <MyOffers
        offers={offers}
        onNavigate={navigate}
        onSelectOffer={setSelectedOffer}
        selectedOffer={selectedOffer}
        addingOffer={addingOffer}
        onAddOffer={() => {
          setSelectedOffer(null)
          setAddingOffer(true)
        }}
        onSaveOffer={saveOffer}
        onDeleteOffer={deleteOffer}
        onCancelEdit={() => {
          setSelectedOffer(null)
          setAddingOffer(false)
        }}
      />
    )
  }

  return (
    <Dashboard
      onNavigate={navigate}
      onAddOffer={addOffer}
      offers={offers}
    />
  )
}
