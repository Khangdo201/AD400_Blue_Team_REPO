import { describe, expect, it } from 'vitest'
import { theme } from './theme'

describe('theme', () => {
  it('matches the CareerCompare design tokens', () => {
    expect(theme).toEqual({
      text: '#321C07',
      primary: { default: '#7AAB8F', dark: '#4F7F68', light: '#C1F1C1' },
      secondary: { sage: '#9BC3A8', mint: '#DFF4E6' },
      accent: { yellow: '#E8C66A' },
      state: {
        success: '#58B77B',
        warning: '#F2B84B',
        error: '#E05A5A',
        info: '#5FA8D3',
      },
    })
  })
})
