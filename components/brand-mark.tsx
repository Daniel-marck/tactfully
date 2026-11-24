export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-xl"
      style={{ width: size, height: size, background: '#234B3B' }}
    >
      <svg viewBox="0 0 180 180" width={size * 0.82} height={size * 0.82} fill="none">
        <path d="M42 38C42 27.954 50.954 20 61 20H119C129.046 20 137 27.954 137 38V105C137 115.046 129.046 123 119 123H83L54 148V123H61C50.954 123 42 115.046 42 105V38Z" fill="#F5F0E6"/>
        <path d="M68 55H112V68H96.5V105H83.5V68H68V55Z" fill="#234B3B"/>
        <circle cx="120" cy="139" r="7" fill="#C58A61"/>
      </svg>
    </span>
  )
}
