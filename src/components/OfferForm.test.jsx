import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { mockOffers } from '../test/mockOffers'
import OfferForm from './OfferForm'

async function fillRequiredFields(user) {
  await user.type(screen.getByLabelText(/company name/i), 'Company A')
  await user.type(screen.getByLabelText(/job title/i), 'Junior Developer')
  await user.type(screen.getByLabelText(/annual salary/i), '85000')
}

describe('OfferForm', () => {
  it('renders labeled inputs for every offer detail', () => {
    render(<OfferForm />)

    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/annual salary/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/signing bonus/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/first-year equity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/pto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sick leave/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/employer match/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/work arrangement/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/learning opportunities/i)).toBeInTheDocument()
  })

  it('marks company name, job title, and salary as required', () => {
    render(<OfferForm />)

    expect(screen.getByLabelText(/company name/i)).toBeRequired()
    expect(screen.getByLabelText(/job title/i)).toBeRequired()
    expect(screen.getByLabelText(/annual salary/i)).toBeRequired()
  })

  it('shows errors and does not submit when required fields are empty', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OfferForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: /save offer/i }))

    expect(screen.getAllByRole('alert')).toHaveLength(3)
    expect(screen.getByText(/company name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/job title is required/i)).toBeInTheDocument()
    expect(screen.getByText(/annual salary is required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits entered offer details with numbers parsed', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OfferForm onSubmit={onSubmit} />)

    await fillRequiredFields(user)
    await user.type(screen.getByLabelText(/signing bonus/i), '5000')
    await user.type(screen.getByLabelText(/first-year equity/i), '12000')
    await user.type(screen.getByLabelText(/pto/i), '20')
    await user.type(screen.getByLabelText(/sick leave/i), '10')
    await user.type(screen.getByLabelText(/employer match/i), '4')
    await user.selectOptions(screen.getByLabelText(/work arrangement/i), 'Hybrid')
    await user.type(
      screen.getByLabelText(/learning opportunities/i),
      'Mentorship program',
    )
    await user.click(screen.getByRole('button', { name: /save offer/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({
      companyName: 'Company A',
      jobTitle: 'Junior Developer',
      salary: 85000,
      signingBonus: 5000,
      firstYearEquity: 12000,
      ptoDays: 20,
      sickLeaveDays: 10,
      employerMatch: 4,
      workArrangement: 'Hybrid',
      learningOpportunities: 'Mentorship program',
    })
  })

  it.each(mockOffers)(
    'submits the mock $name offer with numbers parsed',
    async ({ input, expected }) => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<OfferForm onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/company name/i), input.companyName)
      await user.type(screen.getByLabelText(/job title/i), input.jobTitle)
      await user.type(screen.getByLabelText(/annual salary/i), input.salary)
      await user.type(
        screen.getByLabelText(/signing bonus/i),
        input.signingBonus,
      )
      await user.type(
        screen.getByLabelText(/first-year equity/i),
        input.firstYearEquity,
      )
      if (input.ptoDays != null) {
        await user.type(screen.getByLabelText(/pto/i), input.ptoDays)
      }
      if (input.sickLeaveDays != null) {
        await user.type(screen.getByLabelText(/sick leave/i), input.sickLeaveDays)
      }
      await user.type(
        screen.getByLabelText(/employer match/i),
        input.employerMatch,
      )
      await user.selectOptions(
        screen.getByLabelText(/work arrangement/i),
        input.workArrangement,
      )
      await user.type(
        screen.getByLabelText(/learning opportunities/i),
        input.learningOpportunities,
      )
      await user.click(screen.getByRole('button', { name: /save offer/i }))

      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit.mock.calls[0][0]).toEqual(expected)
    },
  )

  it('submits blank optional values as null', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OfferForm onSubmit={onSubmit} />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole('button', { name: /save offer/i }))

    expect(onSubmit.mock.calls[0][0]).toEqual({
      companyName: 'Company A',
      jobTitle: 'Junior Developer',
      salary: 85000,
      signingBonus: null,
      firstYearEquity: null,
      ptoDays: null,
      sickLeaveDays: null,
      employerMatch: null,
      workArrangement: '',
      learningOpportunities: '',
    })
  })

  it('rejects a non-positive salary', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OfferForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/company name/i), 'Company A')
    await user.type(screen.getByLabelText(/job title/i), 'Junior Developer')
    await user.type(screen.getByLabelText(/annual salary/i), '-1')
    await user.click(screen.getByRole('button', { name: /save offer/i }))

    expect(
      screen.getByText(/salary must be greater than zero/i),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<OfferForm onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
