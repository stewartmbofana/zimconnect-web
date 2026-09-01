import { describe, it, expect } from 'vitest'
import { normalizeZimbabweanPhone, buildWhatsAppLink } from './phone'

describe('normalizeZimbabweanPhone', () => {
  it('normalizes a local 0-prefix mobile number', () => {
    expect(normalizeZimbabweanPhone('0771234567')).toBe('+263771234567')
  })

  it('normalizes a local 0-prefix Econet number', () => {
    expect(normalizeZimbabweanPhone('0713456789')).toBe('+263713456789')
  })

  it('passes through an already-normalized +263 number unchanged', () => {
    expect(normalizeZimbabweanPhone('+263771234567')).toBe('+263771234567')
  })

  it('adds + to a 263-prefix number', () => {
    expect(normalizeZimbabweanPhone('263771234567')).toBe('+263771234567')
  })

  it('handles numbers with spaces', () => {
    expect(normalizeZimbabweanPhone('077 123 4567')).toBe('+263771234567')
  })

  it('handles numbers with hyphens', () => {
    expect(normalizeZimbabweanPhone('077-123-4567')).toBe('+263771234567')
  })
})

describe('buildWhatsAppLink', () => {
  it('builds a wa.me link for a local number', () => {
    expect(buildWhatsAppLink('0771234567')).toBe('https://wa.me/263771234567')
  })

  it('builds a wa.me link with a pre-filled message', () => {
    const link = buildWhatsAppLink('0771234567', 'Hi, I saw your listing')
    expect(link).toBe('https://wa.me/263771234567?text=Hi%2C%20I%20saw%20your%20listing')
  })
})
