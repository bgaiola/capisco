interface HelpButtonProps {
  onClick: () => void
  label: string
}

export default function HelpButton({ onClick, label }: HelpButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-warm-gray hover:text-terracotta hover:bg-terracotta/10 active:scale-95 transition-colors cursor-pointer"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-1 .4-1 .9-1 1.7" />
        <line x1="12" y1="17" x2="12" y2="17.01" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    </button>
  )
}
