import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { measureSections, state } from './state'

gsap.registerPlugin(ScrollTrigger)

/** Lenis smooth scrolling, driven by GSAP's ticker and synced with ScrollTrigger. */
export function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    state.reducedMotion = reduced

    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.075,
      smoothWheel: !reduced,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    })
    state.lenis = lenis
    if (import.meta.env.DEV || location.search.includes('debug')) window.__lenis = lenis

    lenis.on('scroll', (e) => {
      state.scrollY = e.animatedScroll
      ScrollTrigger.update()
    })
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const remeasure = () => measureSections()
    ScrollTrigger.addEventListener('refresh', remeasure)
    window.addEventListener('resize', remeasure)
    measureSections()
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(tick)
      ScrollTrigger.removeEventListener('refresh', remeasure)
      window.removeEventListener('resize', remeasure)
      lenis.destroy()
      state.lenis = null
    }
  }, [])
}

/** Cinematic scroll to an element or y offset. */
export function scrollToTarget(target, opts = {}) {
  if (state.lenis) {
    state.lenis.scrollTo(target, {
      duration: 2.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      ...opts,
    })
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : null
    window.scrollTo({ top: el ? el.offsetTop : target, behavior: 'smooth' })
  }
}
