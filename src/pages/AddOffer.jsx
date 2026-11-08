import NavBar from '../components/NavBar'
import OfferForm from '../components/OfferForm'
import './AddOffer.css'

export default function AddOffer({ onSave, onCancel }) {
  return (
    <>
      <NavBar activePage="My Offers" />
      <main className="add-offer">
        <h1 className="add-offer__title">Add Job Offer</h1>
        <p className="add-offer__subtitle">
          Enter the details you have. Leave unknown optional values blank.
        </p>
        <OfferForm onSubmit={onSave} onCancel={onCancel} />
      </main>
    </>
  )
}
