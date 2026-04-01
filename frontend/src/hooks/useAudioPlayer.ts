import { useState, useRef, useCallback } from 'react'
import type { AudioPlayerHook } from '../types'

export function useAudioPlayer(): AudioPlayerHook {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsPlaying(false)
  }, [])

  const play = useCallback(
    (src: string | Blob) => {
      // Stop any current playback
      stop()

      const url = src instanceof Blob ? URL.createObjectURL(src) : src
      const audio = new Audio(url)
      audioRef.current = audio

      audio.onplay = () => setIsPlaying(true)
      audio.onended = () => {
        setIsPlaying(false)
        if (src instanceof Blob) URL.revokeObjectURL(url)
      }
      audio.onerror = () => {
        setIsPlaying(false)
        if (src instanceof Blob) URL.revokeObjectURL(url)
      }

      audio.play().catch(() => {
        setIsPlaying(false)
      })
    },
    [stop],
  )

  return { isPlaying, play, stop }
}
