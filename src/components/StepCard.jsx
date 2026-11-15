import './StepCard.css'

export default function StepCard({ step, title, description }) {
  return (
    <li className="step-card">
      <span className="step-card__badge" aria-hidden="true">
        {step}
      </span>
      <h3 className="step-card__title">{title}</h3>
      <p className="step-card__description">{description}</p>
    </li>
  )
}
