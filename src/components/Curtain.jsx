import gsap from 'gsap'

/** Full-screen gradient curtain used for page-level transitions. */
export function Curtain() {
  return (
    <div className="curtain" aria-hidden="true">
      <div className="curtain__panel curtain__panel--a" />
      <div className="curtain__panel curtain__panel--b" />
      <div className="curtain__label">Opening…</div>
    </div>
  )
}

/** Sweep the curtain across the screen, then open an external link. */
export function navigateWithCurtain(url, { newTab = false } = {}) {
  if (newTab) {
    window.open(url, '_blank', 'noopener')
    return
  }
  const tl = gsap.timeline({
    onComplete: () => {
      window.location.href = url
      // If the browser stays (e.g. back navigation cache), reset the curtain
      setTimeout(() => gsap.set('.curtain__panel, .curtain__label', { clearProps: 'all' }), 1500)
    },
  })
  tl.set('.curtain', { pointerEvents: 'auto' })
    .fromTo('.curtain__panel--a', { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' })
    .fromTo('.curtain__panel--b', { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut' }, '-=0.55')
    .fromTo('.curtain__label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
}
