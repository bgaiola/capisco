interface MicButtonProps {
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function MicButton({
  isActive,
  onClick,
  disabled = false,
  size = 'lg',
}: MicButtonProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings when active */}
      {isActive && (
        <>
          <span
            className="absolute rounded-full bg-terracotta/20 animate-pulse-ring"
            style={{
              width: size === 'lg' ? 120 : size === 'md' ? 96 : 72,
              height: size === 'lg' ? 120 : size === 'md' ? 96 : 72,
            }}
          />
          <span
            className="absolute rounded-full bg-terracotta/10 animate-pulse-ring"
            style={{
              width: size === 'lg' ? 150 : size === 'md' ? 120 : 96,
              height: size === 'lg' ? 150 : size === 'md' ? 120 : 96,
              animationDelay: '0.5s',
            }}
          />
        </>
      )}

      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          relative z-10 rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${
            isActive
              ? 'bg-terracotta text-white shadow-lg scale-110'
              : 'bg-terracotta/10 text-terracotta hover:bg-terracotta/20 hover:scale-105'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label={isActive ? 'Parar gravação' : 'Iniciar gravação'}
      >
        {isActive ? (
          // Stop icon
          <svg
            className={iconSizes[size]}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          // Mic icon
          <svg
            className={iconSizes[size]}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 10v2a7 7 0 0 1-14 0v-2"
            />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </button>
    </div>
  )
}
