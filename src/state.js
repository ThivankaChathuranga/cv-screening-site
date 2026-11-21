// A tiny mutable store shared by the DOM (scroll, pointer) and the WebGL scene.
// It is read inside useFrame, so updating it never triggers React re-renders.
export const state = {
  scrollY: 0,
  vh: typeof window !== 'undefined' ? window.innerHeight : 800,
  maxScroll: 1,
  sections: {}, // name -> { top, height }
  pointer: { x: 0, y: 0 },
  drag: { active: false, velocity: 0 },
  hoveredDoc: -1,
  pulse: 0, // set to 1 when the AI core is clicked
  quality: 'high', // 'high' | 'low'
  isMobile: false,
  reducedMotion: false,
  lenis: null,
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const range = (v, a, b) => clamp((v - a) / (b - a))
export const smooth = (t) => t * t * (3 - 2 * t)
export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10)
export const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/** 0 when the section's top reaches mid-screen, 1 when its bottom does. */
export function local(name) {
  const s = state.sections[name]
  if (!s) return 0
  return clamp((state.scrollY + state.vh / 2 - s.top) / s.height)
}

/** 0..1 visibility: how much of the section (incl. a margin) is near the viewport. */
export function near(name, margin = 1) {
  const s = state.sections[name]
  if (!s) return 0
  const y = state.scrollY
  return y + state.vh * (1 + margin) > s.top && y - state.vh * margin < s.top + s.height
}

export function measureSections() {
  state.vh = window.innerHeight
  state.maxScroll = Math.max(1, document.documentElement.scrollHeight - state.vh)
  document.querySelectorAll('[data-stage]').forEach((el) => {
    const r = el.getBoundingClientRect()
    state.sections[el.dataset.stage] = { top: r.top + window.scrollY, height: r.height }
  })
}
