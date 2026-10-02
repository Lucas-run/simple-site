import { useCallback, useRef, useState } from 'react'

type CopyStatus = 'idle' | 'copied' | 'error'

const RESET_DELAY = 2000

export function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timer = useRef<number | undefined>(undefined)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), RESET_DELAY)
  }, [])

  return { status, copy }
}
