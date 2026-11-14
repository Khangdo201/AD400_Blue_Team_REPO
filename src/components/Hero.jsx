import './Hero.css'

export default function Hero({ onAddOffer }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero__eyebrow">Your next chapter</p>
      <div className="hero__card">
        <h1 id="hero-title" className="hero__title">
          Compare your offers.
          <br /> Choose your next step.
        </h1>
        <p className="hero__subtitle">
          Review salary, benefits, and career opportunities in one place.
        </p>
        <button type="button" className="hero__button" onClick={onAddOffer}>
          + Add Job Offer
        </button>
      </div>
    </section>
  )
}
