import { useEffect, useRef, useState } from 'react'
import { scrollToTarget } from '../useSmoothScroll'
import { state } from '../state'

const ITEMS = [
  ['#how', 'How it works'],
  ['#explain', 'Explainable'],
  ['#results', 'Results'],
  ['#privacy', 'Privacy'],
]

export function Nav({ onNavigate, onTry }) {
  const bar = useRef()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let raf
    const loop = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${state.scrollY / state.maxScroll})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(href, { offset: 0 })
  }

  return (
    <header className={`nav glass ${open ? 'is-open' : ''}`}>
      <a href="#top" className="nav__brand" onClick={(e) => go(e, 0)}>
        cv<span>/</span>nlp
      </a>
      <nav className="nav__links">
        {ITEMS.map(([href, label]) => (
          <a key={href} href={href} onClick={(e) => go(e, href)}>
            {label}
          </a>
        ))}
      </nav>
      <button className="btn btn--small btn--primary nav__cta" onClick={onTry}>
        Try it
      </button>
      <button className="nav__burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <i /><i />
      </button>
      <div className="nav__progress" ref={bar} />
    </header>
  )
}
