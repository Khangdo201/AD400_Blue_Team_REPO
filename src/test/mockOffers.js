// Mock offer: Software Engineer at Tech Startup
// 20,000 options at $2.50 strike vesting over 4 years with a 1-year cliff
// -> first-year equity = 5,000 shares x $2.50 = $12,500
// Unlimited PTO and unspecified sick leave are left blank.

export const techStartupOfferInput = {
  companyName: 'Tech Startup',
  jobTitle: 'Software Engineer',
  salary: '120000',
  signingBonus: '10000',
  firstYearEquity: '12500',
  employerMatch: '4',
  workArrangement: 'Hybrid',
  learningOpportunities:
    'Fast-paced environment with potential for leadership roles within 2-3 years',
}

export const techStartupOffer = {
  companyName: 'Tech Startup',
  jobTitle: 'Software Engineer',
  salary: 120000,
  signingBonus: 10000,
  firstYearEquity: 12500,
  ptoDays: null,
  sickLeaveDays: null,
  employerMatch: 4,
  workArrangement: 'Hybrid',
  learningOpportunities:
    'Fast-paced environment with potential for leadership roles within 2-3 years',
}

// Mock offer: Software Engineer at Established Corporation
// $50,000 of RSUs vesting 1/3 per year -> first-year equity ~= $16,666.67
// PTO = 20 vacation days + 5 personal days = 25

export const establishedCorpOfferInput = {
  companyName: 'Established Corporation',
  jobTitle: 'Software Engineer',
  salary: '135000',
  signingBonus: '15000',
  firstYearEquity: '16666.67',
  ptoDays: '25',
  sickLeaveDays: '12',
  employerMatch: '6',
  workArrangement: 'Remote',
  learningOpportunities:
    'Well-defined promotion track with opportunities for skill-building and professional certifications',
}

export const establishedCorpOffer = {
  companyName: 'Established Corporation',
  jobTitle: 'Software Engineer',
  salary: 135000,
  signingBonus: 15000,
  firstYearEquity: 16666.67,
  ptoDays: 25,
  sickLeaveDays: 12,
  employerMatch: 6,
  workArrangement: 'Remote',
  learningOpportunities:
    'Well-defined promotion track with opportunities for skill-building and professional certifications',
}

export const mockOffers = [
  {
    name: 'Software Engineer at Tech Startup',
    input: techStartupOfferInput,
    expected: techStartupOffer,
  },
  {
    name: 'Software Engineer at Established Corporation',
    input: establishedCorpOfferInput,
    expected: establishedCorpOffer,
  },
]
