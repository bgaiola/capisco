import { useState, useRef, useCallback, useEffect } from 'react'
import type { MediaRecorderHook } from '../types'

export function useMediaRecorder(): MediaRecorderHook {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<number>(0)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animFrameRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return
    const data = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(data)
    const avg = data.reduce((a, b) => a + b, 0) / data.length
    setAudioLevel(avg / 255)
    animFrameRef.current = requestAnimationFrame(updateAudioLevel)
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Setup analyser for volume visualization
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })

      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setIsRecording(false)
        if (timerRef.current) clearInterval(timerRef.current)
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
        setAudioLevel(0)
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorderRef.current = recorder
      recorder.start(100) // Collect data every 100ms

      startTimeRef.current = Date.now()
      setIsRecording(true)
      setDuration(0)

      // Update duration every second
      timerRef.current = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)

      // Start audio level monitoring
      updateAudioLevel()
    } catch {
      console.error('Failed to start recording')
    }
  }, [updateAudioLevel])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    setDuration(0)
    setAudioLevel(0)
    chunksRef.current = []
  }, [])

  return {
    isRecording,
    audioBlob,
    duration,
    audioLevel,
    startRecording,
    stopRecording,
    resetRecording,
  }
}
