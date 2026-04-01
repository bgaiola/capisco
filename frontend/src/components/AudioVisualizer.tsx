interface AudioVisualizerProps {
  isActive: boolean
  level?: number
  barCount?: number
  color?: string
}

export default function AudioVisualizer({
  isActive,
  level = 0,
  barCount = 24,
  color = 'bg-terracotta',
}: AudioVisualizerProps) {
  return (
    <div className="flex items-end justify-center gap-[2px] h-16 px-4">
      {Array.from({ length: barCount }).map((_, i) => {
        // Create a wave-like pattern
        const center = barCount / 2
        const distFromCenter = Math.abs(i - center) / center
        const baseHeight = isActive
          ? Math.max(0.1, (1 - distFromCenter) * level)
          : 0.05

        // Add some randomness when active
        const randomFactor = isActive ? 0.8 + Math.random() * 0.4 : 1
        const height = Math.min(1, baseHeight * randomFactor)

        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-75 ${color} ${
              isActive ? 'opacity-80' : 'opacity-20'
            }`}
            style={{
              height: `${Math.max(4, height * 64)}px`,
            }}
          />
        )
      })}
    </div>
  )
}
