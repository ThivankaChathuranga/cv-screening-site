import { useCallback, useEffect, useRef, useState } from 'react'

/** Talks to the screening worker. */
export function useScreener() {
  const worker = useRef(null)
  const [progress, setProgress] = useState(null)
  const pending = useRef(new Map())

  useEffect(() => {
    const w = new Worker(new URL('../engine/worker.js', import.meta.url), { type: 'module' })
    w.onmessage = ({ data }) => {
      const p = pending.current.get(data.id)
      if (!p) return
      if (data.type === 'progress') setProgress({ stage: data.stage, value: data.value })
      if (data.type === 'result') {
        pending.current.delete(data.id)
        setProgress(null)
        p.resolve(data.result)
      }
      if (data.type === 'error') {
        pending.current.delete(data.id)
        setProgress(null)
        p.reject(new Error(data.message))
      }
    }
    worker.current = w
    return () => w.terminate()
  }, [])

  const run = useCallback((payload) => {
    const id = Math.random().toString(36).slice(2)
    return new Promise((resolve, reject) => {
      pending.current.set(id, { resolve, reject })
      setProgress({ stage: 'Starting', value: 0 })
      worker.current.postMessage({ id, payload })
    })
  }, [])

  return { run, progress }
}
