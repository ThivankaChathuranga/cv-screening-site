import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { Experience } from './three/Experience'
import { Sections } from './components/Sections'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { Curtain, navigateWithCurtain } from './components/Curtain'
import { useSmoothScroll } from './useSmoothScroll'
import { ScreeningApp } from './app/ScreeningApp'
import { state } from './state'

const DEBUG = import.meta.env.DEV || new URLSearchParams(location.search).has('debug')
const isMobile = () => window.matchMedia('(max-width: 820px), (pointer: coarse)').matches
state.isMobile = isMobile()

export default function App() {
  const [ready, setReady] = useState(false)
  const [entered, setEntered] = useState(false)
  const [appOpen, setAppOpen] = useState(() => location.hash === '#try')
  const dragStart = useRef(null)
  useSmoothScroll()

  // Pointer parallax + drag-to-spin for the hero orbit
  useEffect(() => {
    const move = (e) => {
      state.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      state.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      if (dragStart.current != null) {
        const dx = e.clientX - dragStart.current
        state.drag.velocity += dx * 0.012
        dragStart.current = e.clientX
      }
    }
    const down = (e) => {
      if (e.target.tagName === 'CANVAS' && e.pointerType === 'mouse') dragStart.current = e.clientX
    }
    const up = () => (dragStart.current = null)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  // Lock page scrolling until the intro has played, and while the app is open
  useEffect(() => {
    if (!state.lenis) return
    entered && !appOpen ? state.lenis.start() : state.lenis.stop()
  }, [entered, ready, appOpen])

  // While the app is open, hide the page underneath (after the reveal finishes)
  useEffect(() => {
    document.body.classList.toggle('app-open', appOpen)
  }, [appOpen])

  // Open the screening app with a circular reveal from the click point
  const openApp = useCallback((e) => {
    const el = document.querySelector('.app')
    if (el && e?.clientX != null) {
      el.style.setProperty('--ox', `${e.clientX}px`)
      el.style.setProperty('--oy', `${e.clientY}px`)
    }
    history.replaceState(null, '', '#try')
    setAppOpen(true)
  }, [])
  const closeApp = useCallback(() => {
    history.replaceState(null, '', location.pathname + location.search)
    setAppOpen(false)
  }, [])

  const onReady = useCallback(() => setReady(true), [])

  const onEnter = useCallback(() => {
    setEntered(true)
    gsap.fromTo(
      '.hero [data-intro]',
      { yPercent: 110, opacity: 0, rotateX: -35 },
      { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, delay: 0.15 }
    )
  }, [])

  return (
    <>
      <div className="webgl" aria-hidden="true">
        <Canvas
          shadows="percentage"
          frameloop={appOpen && ready ? 'never' : 'always'}
          dpr={[1, state.isMobile ? 1.25 : 1.75]}
          gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
          camera={{ position: [0, 0.25, 9.6], fov: 40, near: 0.1, far: 120 }}
          onCreated={(root) => {
            const { gl, camera, scene } = root
            if (DEBUG) window.__three = { camera, scene, state, get: root.get }
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.outputColorSpace = THREE.SRGBColorSpace
          }}
        >
          <Suspense fallback={null}>
            <Experience onReady={onReady} />
          </Suspense>
        </Canvas>
      </div>

      <Nav onNavigate={navigateWithCurtain} onTry={openApp} />
      <main className="content">
        <Sections onExternal={navigateWithCurtain} onTry={openApp} />
      </main>
      <ScreeningApp open={appOpen} onClose={closeApp} />

      <Preloader ready={ready} onEnter={onEnter} />
      <Curtain />
    </>
  )
}
