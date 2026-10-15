/** Same mark as the favicon: bolt with a notification dot. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#413284" />
      <path fill="#fff" d="M37 6 L16 35 H29 L25 58 L48 27 H35 Z" />
      <circle cx="49" cy="15" r="10.5" fill="#413284" />
      <circle cx="49" cy="15" r="7.5" fill="#F2B600" />
    </svg>
  )
}
