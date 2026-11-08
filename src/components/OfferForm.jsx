import { useForm } from 'react-hook-form'
import './OfferForm.css'

const numberOrNull = (value) => (value === '' || value == null ? null : Number(value))

const optionalNumber = {
  setValueAs: numberOrNull,
  validate: (value) =>
    value === null || Number.isFinite(value) || 'Enter a valid number',
}

const FIELDS = [
  {
    name: 'companyName',
    label: 'Company name',
    placeholder: 'Company A',
    required: true,
    rules: { required: 'Company name is required' },
  },
  {
    name: 'jobTitle',
    label: 'Job title',
    placeholder: 'Junior Developer',
    required: true,
    rules: { required: 'Job title is required' },
  },
  {
    name: 'salary',
    label: 'Annual salary ($)',
    type: 'number',
    placeholder: '85000',
    required: true,
    rules: {
      required: 'Annual salary is required',
      setValueAs: numberOrNull,
      validate: (value) =>
        (Number.isFinite(value) && value > 0) ||
        'Salary must be greater than zero',
    },
  },
  {
    name: 'signingBonus',
    label: 'Signing bonus ($)',
    type: 'number',
    placeholder: '5000',
    rules: optionalNumber,
  },
  {
    name: 'firstYearEquity',
    label: 'First-year equity ($)',
    type: 'number',
    placeholder: 'Not provided',
    rules: optionalNumber,
  },
  {
    name: 'ptoDays',
    label: 'PTO (days/year)',
    type: 'number',
    placeholder: '20',
    rules: optionalNumber,
  },
  {
    name: 'sickLeaveDays',
    label: 'Sick leave (days/year)',
    type: 'number',
    placeholder: '10',
    rules: optionalNumber,
  },
  {
    name: 'employerMatch',
    label: '401(k) employer match (%)',
    type: 'number',
    placeholder: '4',
    rules: optionalNumber,
  },
  {
    name: 'workArrangement',
    label: 'Work arrangement',
    type: 'select',
    options: ['Remote', 'Hybrid', 'On-site'],
  },
  {
    name: 'learningOpportunities',
    label: 'Learning opportunities',
    placeholder: 'Mentorship program',
  },
]

export default function OfferForm({ onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: '',
      jobTitle: '',
      salary: '',
      signingBonus: '',
      firstYearEquity: '',
      ptoDays: '',
      sickLeaveDays: '',
      employerMatch: '',
      workArrangement: '',
      learningOpportunities: '',
    },
  })

  return (
    <form className="offer-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="offer-form__grid">
        {FIELDS.map(
          ({ name, label, type = 'text', placeholder, required, rules, options }) => (
            <div className="offer-form__field" key={name}>
              <label className="offer-form__label" htmlFor={name}>
                {label}
                {required && (
                  <span className="offer-form__required" aria-hidden="true">
                    {' '}
                    *
                  </span>
                )}
              </label>
              {type === 'select' ? (
                <select
                  id={name}
                  className="offer-form__input"
                  {...register(name)}
                >
                  <option value="">Not specified</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={name}
                  className="offer-form__input"
                  type={type}
                  placeholder={placeholder}
                  required={required}
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={errors[name] ? `${name}-error` : undefined}
                  {...register(name, rules)}
                />
              )}
              {errors[name] && (
                <p
                  className="offer-form__error"
                  id={`${name}-error`}
                  role="alert"
                >
                  {errors[name].message}
                </p>
              )}
            </div>
          ),
        )}
      </div>
      <div className="offer-form__actions">
        <button type="submit" className="offer-form__submit">
          Save Offer
        </button>
        <button
          type="button"
          className="offer-form__cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
