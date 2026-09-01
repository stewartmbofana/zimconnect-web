/**
 * Normalizes a Zimbabwean phone number to international E.164 format (+263…).
 *
 * Handles formats:
 *   - 077xxxxxxx    →  +26377xxxxxxx
 *   - 0713xxxxxx    →  +263713xxxxxx
 *   - +263xxxxxxxxx →  +263xxxxxxxxx (already normalized)
 *   - 263xxxxxxxxx  →  +263xxxxxxxxx
 */
export function normalizeZimbabweanPhone(raw: string): string {
  // Strip all whitespace and non-numeric characters except leading +
  const stripped = raw.replace(/[^\d+]/g, '').trim()

  if (stripped.startsWith('+263')) {
    return stripped
  }

  if (stripped.startsWith('263')) {
    return `+${stripped}`
  }

  if (stripped.startsWith('0')) {
    return `+263${stripped.slice(1)}`
  }

  // Assume local number with no leading digit
  return `+263${stripped}`
}

/**
 * Builds a WhatsApp deep link for the given raw phone number.
 */
export function buildWhatsAppLink(rawPhone: string, message?: string): string {
  const normalized = normalizeZimbabweanPhone(rawPhone)
  // wa.me expects digits only (no +)
  const digits = normalized.replace('+', '')
  const base = `https://wa.me/${digits}`
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`
  }
  return base
}
