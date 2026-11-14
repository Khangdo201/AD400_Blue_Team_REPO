import Hero from '../components/Hero'
import NavBar from '../components/NavBar'
import StepCard from '../components/StepCard'
import './Dashboard.css'

const STEPS = [
  { title: 'Add Offer', description: 'Enter compensation and benefits.' },
  { title: 'View My Offers', description: 'Review and manage saved offers.' },
  { title: 'Set Priorities', description: 'Choose what matters most to you.' },
]

export default function Dashboard({ onAddOffer, onNavigate }) {
  return (
    <>
      <NavBar activePage="Dashboard" onNavigate={onNavigate} />
      <main className="dashboard">
        <Hero onAddOffer={onAddOffer} />
        <section className="dashboard__steps" aria-labelledby="steps-title">
          <h2 id="steps-title" className="dashboard__steps-title">
            Everything you need to decide
          </h2>
          <ol className="dashboard__step-list" aria-label="Steps">
            {STEPS.map((step, index) => (
              <StepCard key={step.title} step={index + 1} {...step} />
            ))}
          </ol>
        </section>
      </main>
    </>
  )
}
