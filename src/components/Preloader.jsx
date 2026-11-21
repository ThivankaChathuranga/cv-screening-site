import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/** Counts up while the WebGL scene compiles, then lifts away like a curtain. */
export function Preloader({ ready, onEnter }) {
  const [pct, setPct] = useState(0)
  const root = useRef()
  const done = useRef(false)

  useEffect(() => {
    let raf
    const tick = () => {
      setPct((p) => {
        const cap = ready ? 100 : 86
        return Math.min(cap, p + Math.max(0.4, (cap - p) * (ready ? 0.12 : 0.03)))
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ready])

  useEffect(() => {
    if (pct < 99.5 || done.current) return
    done.current = true
    const tl = gsap.timeline({ onComplete: () => root.current && (root.current.style.display = 'none') })
    tl.to('.preloader__count, .preloader__brand, .preloader__bar', {
      yPercent: -120, opacity: 0, duration: 0.7, ease: 'expo.in', stagger: 0.05,
    })
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.2')
      .add(onEnter, '-=0.6')
  }, [pct, onEnter])

  return (
    <div className="preloader" ref={root}>
      <div className="preloader__brand">cv<span>/</span>nlp</div>
      <div className="preloader__count">{Math.floor(pct).toString().padStart(3, '0')}</div>
      <div className="preloader__bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
    </div>
  )
}
