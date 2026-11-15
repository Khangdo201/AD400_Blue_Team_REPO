import { useState } from 'react'
import NavBar from '../components/NavBar'
import './MyOffers.css'

const formatSalary = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0)

function OfferEditor({ offer, onSave, onCancel }) {
  const [companyName, setCompanyName] = useState(offer?.companyName ?? '')
  const [jobTitle, setJobTitle] = useState(offer?.jobTitle ?? '')
  const [salary, setSalary] = useState(String(offer?.salary ?? ''))
  const [workArrangement, setWorkArrangement] = useState(offer?.workArrangement ?? '')
  const [error, setError] = useState('')
  function submit(event) {
    event.preventDefault()
    if (!companyName.trim() || !jobTitle.trim() || salary === '' || !Number.isFinite(Number(salary)) || Number(salary) < 0) {
      setError('Enter a company, job title, and valid annual salary.')
      return
    }
    onSave({ ...(offer || {}), companyName: companyName.trim(), jobTitle: jobTitle.trim(), salary: Number(salary), workArrangement })
  }
  return <section className="offer-editor" aria-label={offer ? 'Edit job offer' : 'Add job offer'}>
    <div className="offer-editor__top"><div><span className="eyebrow">YOUR NEXT STEP</span><h2>{offer ? 'Edit job offer' : 'Add a job offer'}</h2><p>Keep your opportunities organized in one place.</p></div><button className="offer-editor__close" type="button" onClick={onCancel} aria-label="Close form">×</button></div>
    <form onSubmit={submit} className="offer-editor__form">
      <label>Company name<input autoFocus value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Google" /></label>
      <label>Job title<input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer" /></label>
      <label>Annual salary (USD)<input type="number" min="0" step="1" value={salary} onChange={e => setSalary(e.target.value)} placeholder="120000" /></label>
      <label>Work arrangement<select value={workArrangement} onChange={e => setWorkArrangement(e.target.value)}><option value="">Not specified</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
      {error && <p className="offer-editor__error" role="alert">{error}</p>}
      <div className="offer-editor__actions"><button className="button button--outline" type="button" onClick={onCancel}>Cancel</button><button className="button button--primary" type="submit">{offer ? 'Save changes' : 'Save offer'}</button></div>
    </form>
  </section>
}

export default function MyOffers({ offers = [], onNavigate, onSelectOffer, selectedOffer, addingOffer = false, onAddOffer, onSaveOffer, onDeleteOffer, onCancelEdit }) {
  const editing = addingOffer || selectedOffer != null
  function confirmDelete(offer) {
    if (window.confirm(`Delete the offer from ${offer.companyName}? This cannot be undone.`)) onDeleteOffer?.(offer.id)
  }
  return <><NavBar activePage="My Offers" onNavigate={onNavigate} />
    <main className="my-offers">
      <div className="my-offers__intro"><div><span className="eyebrow">YOUR OPPORTUNITIES</span><h1 className="my-offers__title">My Job Offers<span className="my-offers__count">{offers.length}</span></h1><p className="my-offers__subtitle">A clearer view of your next career move. Review, edit, and manage your offers.</p></div>{onAddOffer && <button type="button" className="button button--primary my-offers__add" onClick={onAddOffer} aria-label="Add Offer">+ Add job offer</button>}</div>
      {editing && onSaveOffer && <OfferEditor key={selectedOffer?.id ?? 'new'} offer={selectedOffer} onSave={onSaveOffer} onCancel={onCancelEdit} />}
      <div className="my-offers__section-heading"><h2>Saved offers</h2><span>{offers.length} {offers.length === 1 ? 'opportunity' : 'opportunities'}</span></div>
      {offers.length === 0 ? <div className="my-offers__empty"><h3>You haven't saved any offers yet</h3><p>Add one to get started comparing opportunities.</p></div> : <ul className="my-offers__list" aria-label="Saved offers">
        {offers.map((offer, index) => <li key={offer.id ?? `${offer.companyName}-${index}`} className="my-offers__item"><div className="my-offers__card-head"><span className="my-offers__avatar" aria-hidden="true">{offer.companyName?.charAt(0)?.toUpperCase() || '?'}</span><span className="my-offers__tag">Offer {index + 1}</span></div><button type="button" className="my-offers__offer" onClick={() => onSelectOffer?.(offer)}><span className="my-offers__company">{offer.companyName}</span><span className="my-offers__job">{offer.jobTitle}</span><span className="my-offers__salary">{formatSalary(offer.salary)}<small> / year</small></span><span className="my-offers__salary-label">Annual base salary</span></button><div className="my-offers__card-footer"><span className="my-offers__arrangement">{offer.workArrangement || 'Arrangement not specified'}</span><div className="my-offers__actions"><button type="button" className="my-offers__edit" onClick={() => onSelectOffer?.(offer)}>Edit</button>{onDeleteOffer && <button type="button" className="my-offers__delete" onClick={() => confirmDelete(offer)}>Delete</button>}</div></div></li>)}
      </ul>}
      <p className="my-offers__note">Your changes are saved for this session. Connect persistent storage before using real offer data.</p>
    </main>
  </>
}
