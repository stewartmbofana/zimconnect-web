/**
 * NationalAccentRibbon — the Pa~ZimConnect brand stripe: emerald | gold | crimson.
 * This element is also the stealth trigger zone for admin access (see stealthTrigger.ts).
 */
interface Props {
  onSecretClick?: () => void
}

export function NationalAccentRibbon({ onSecretClick }: Props) {
  return (
    <div
      className="flex h-1.5 w-full cursor-default select-none"
      onClick={onSecretClick}
      aria-hidden="true"
    >
      <div className="flex-1 bg-brand-emerald" />
      <div className="flex-1 bg-brand-gold" />
      <div className="flex-1 bg-brand-crimson" />
    </div>
  )
}
