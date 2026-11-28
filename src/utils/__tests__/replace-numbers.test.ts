import { describe, expect, it } from 'vitest'
import { toEnglishNumbers } from '../replace-numbers'

describe('toEnglishNumbers', () => {
  it('converts Persian digits to English', () => {
    expect(toEnglishNumbers('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789')
  })

  it('converts Arabic digits to English', () => {
    expect(toEnglishNumbers('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789')
  })

  it('leaves English digits untouched', () => {
    expect(toEnglishNumbers('0123456789')).toBe('0123456789')
  })

  it('converts digits inside mixed text', () => {
    expect(toEnglishNumbers('قیمت: ۱۲۳ تومان')).toBe('قیمت: 123 تومان')
    expect(toEnglishNumbers('Table ٤ / order ٧')).toBe('Table 4 / order 7')
  })

  it('returns strings without digits unchanged', () => {
    expect(toEnglishNumbers('hello')).toBe('hello')
    expect(toEnglishNumbers('')).toBe('')
  })
})
