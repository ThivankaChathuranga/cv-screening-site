import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import { local, range, smoother, state } from '../state'
import { COLORS } from '../config'

// Fictional candidates (no real people)
export const CANDIDATES = [
  { name: 'Nadeesha Perera', role: 'HR Executive', skills: ['Recruitment', 'Payroll', 'EPF/ETF'], score: 82, band: 'Shortlist' },
  { name: 'Kasun Fernando', role: 'Data Analyst', skills: ['Python', 'SQL', 'Power BI'], score: 68, band: 'Shortlist' },
  { name: 'Ishara Silva', role: 'People Ops Officer', skills: ['Hiring', 'HRIS', 'Welfare'], score: 68, band: 'Shortlist' },
  { name: 'Amila Gunawardena', role: 'Process Engineer', skills: ['SMT', 'Six Sigma', 'FMEA'], score: 61, band: 'Review' },
  { name: 'Dilini Jayasinghe', role: 'Payroll Officer', skills: ['Payroll', 'Excel', 'EPF/ETF'], score: 47, band: 'Review' },
  { name: 'Ruwan Bandara', role: 'Quality Engineer', skills: ['ISO 9001', '8D', 'IPC-A-610'], score: 52, band: 'Review' },
  { name: 'Tharindu Herath', role: 'Talent Acquisition', skills: ['Sourcing', 'Onboarding'], score: 44, band: 'Review' },
  { name: 'Sachini Abeysekara', role: 'Marketing Executive', skills: ['Campaigns', 'Branding'], score: 21, band: 'Reject' },
  { name: 'Harsha Wickrama', role: 'Production Supervisor', skills: ['Lean', '5S', 'KPIs'], score: 33, band: 'Reject' },
  { name: 'Piumi Rathnayake', role: 'People Analytics', skills: ['SQL', 'Python', 'HRIS'], score: 63, band: 'Review' },
]

const BAND_COLOR = { Shortlist: COLORS.mint, Review: COLORS.amber, Reject: COLORS.coral }
const W = 1.3
const H = 1.75
const TEX_W = 512
const TEX_H = Math.round((TEX_W * H) / W)

// Areas to redact (in texture pixels): avatar, name, contact line
const REDACT = [
  { x: 28, y: 34, w: 72, h: 72 },
  { x: 116, y: 40, w: 300, h: 34 },
  { x: 40, y: 128, w: 420, h: 24 },
]
const px2local = (x, y) => [(x / TEX_W - 0.5) * W, (0.5 - y / TEX_H) * H]

function drawCV(c, i) {
  const cv = document.createElement('canvas')
  cv.width = TEX_W
  cv.height = TEX_H
  const g = cv.getContext('2d')
  const font = (w, s) => `${w} ${s}px "Inter Variable", Inter, system-ui, sans-serif`
  g.fillStyle = '#f7f5f0'
  g.fillRect(0, 0, TEX_W, TEX_H)
  // subtle paper grain
  for (let k = 0; k < 2200; k++) {
    g.fillStyle = `rgba(0,0,0,${Math.random() * 0.025})`
    g.fillRect(Math.random() * TEX_W, Math.random() * TEX_H, 1.5, 1.5)
  }
  g.fillStyle = ['#1d4f8c', '#2a78d6', '#3a5f7d'][i % 3]
  g.fillRect(0, 0, TEX_W, 8)
  // avatar
  g.fillStyle = '#c9d3e0'
  g.beginPath(); g.arc(64, 70, 34, 0, Math.PI * 2); g.fill()
  g.fillStyle = '#93a3b8'
  g.beginPath(); g.arc(64, 62, 13, 0, Math.PI * 2); g.fill()
  g.beginPath(); g.ellipse(64, 96, 22, 14, 0, Math.PI, 0); g.fill()
  // name + role
  g.fillStyle = '#10131a'; g.font = font(700, 30); g.fillText(c.name, 118, 66)
  g.fillStyle = '#5b6372'; g.font = font(500, 20); g.fillText(c.role, 118, 96)
  g.fillStyle = '#7b8494'; g.font = font(400, 16)
  g.fillText(`${c.name.split(' ')[0].toLowerCase()}@example.com  ·  +94 77 ${100 + i * 37} ${4400 + i * 211}`, 42, 146)
  g.fillStyle = '#e1ded6'; g.fillRect(40, 168, TEX_W - 80, 2)
  const heading = (t, y) => {
    g.fillStyle = '#1d4f8c'; g.font = font(700, 15); g.fillText(t.split('').join(String.fromCharCode(8202)), 42, y)
  }
  const lines = (y0, n, seed) => {
    for (let k = 0; k < n; k++) {
      const len = 0.55 + 0.4 * Math.abs(Math.sin(seed * 3.1 + k * 1.7))
      g.fillStyle = k % 3 === 0 ? '#9aa2ae' : '#c4c8cf'
      g.beginPath(); g.roundRect(42, y0 + k * 22, (TEX_W - 84) * len, 9, 4); g.fill()
    }
  }
  heading('EXPERIENCE', 206); lines(222, 6, i)
  heading('SKILLS', 384)
  let x = 42
  c.skills.forEach((s, k) => {
    g.font = font(600, 16)
    const w = g.measureText(s).width + 26
    g.fillStyle = ['#e3eefc', '#e5f6ee', '#f1ebfb'][k % 3]
    g.beginPath(); g.roundRect(x, 400, w, 32, 16); g.fill()
    g.fillStyle = ['#1d4f8c', '#106b45', '#5a3f9e'][k % 3]
    g.fillText(s, x + 13, 422)
    x += w + 10
  })
  heading('EDUCATION', 480); lines(496, 2, i + 4)
  heading('PROJECTS', 572); lines(588, 3, i + 9)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function DocCard({ c, i, texture, refs, hovered, setHovered }) {
  const redactRefs = useRef([])
  refs.current[i] = refs.current[i] || {}
  refs.current[i].redact = redactRefs

  return (
    <group
      ref={(el) => (refs.current[i].group = el)}
      onPointerOver={(e) => {
        if (!refs.current[i].interactive) return
        e.stopPropagation()
        setHovered(i)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(-1)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        if (!refs.current[i].interactive) return
        e.stopPropagation()
        refs.current[i].spin = (refs.current[i].spin || 0) + Math.PI * 2
      }}
    >
      <group ref={(el) => (refs.current[i].inner = el)}>
        <RoundedBox args={[W, H, 0.03]} radius={0.025} smoothness={4} castShadow receiveShadow>
          <meshPhysicalMaterial color={COLORS.paper} roughness={0.62} sheen={0.4} sheenRoughness={0.6} clearcoat={0.15} clearcoatRoughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0, 0.0162]}>
          <planeGeometry args={[W - 0.02, H - 0.02]} />
          <meshStandardMaterial map={texture} roughness={0.55} metalness={0} />
        </mesh>
        {REDACT.map((r, k) => {
          const [lx, ly] = px2local(r.x, r.y + r.h / 2)
          const w = (r.w / TEX_W) * W
          const h = (r.h / TEX_H) * H
          return (
            <group key={k} position={[lx, ly, 0.018]}>
              <mesh ref={(el) => (redactRefs.current[k] = el)} position={[w / 2, 0, 0]} scale={[0.0001, 1, 1]}>
                <planeGeometry args={[w, h]} />
                <meshStandardMaterial color="#0b0e15" roughness={0.35} metalness={0.2} />
              </mesh>
            </group>
          )
        })}
        {/* band accent on the edge, visible when the document is scored */}
        <mesh position={[W / 2 - 0.08, H / 2 - 0.08, 0.019]}>
          <circleGeometry args={[0.035, 24]} />
          <meshBasicMaterial color={BAND_COLOR[c.band]} toneMapped={false} />
        </mesh>
      </group>
      {hovered === i && (
        <Html position={[0, H / 2 + 0.22, 0]} center distanceFactor={4.2} zIndexRange={[20, 0]}>
          <div className="doc-tip">
            <div className="doc-tip__name">{c.name}</div>
            <div className="doc-tip__row">
              <span className="doc-tip__score">{c.score}</span>
              <span className={`badge badge--${c.band.toLowerCase()}`}>{c.band}</span>
            </div>
            <div className="doc-tip__hint">click to spin</div>
          </div>
        </Html>
      )}
    </group>
  )
}

const dummy = new THREE.Object3D()
const v = new THREE.Vector3()
const q = new THREE.Quaternion()
const ORIGIN = new THREE.Vector3()

export function Documents({ count = 10 }) {
  const list = CANDIDATES.slice(0, count)
  const refs = useRef([])
  const [hovered, setHoveredState] = useState(-1)
  const [textures, setTextures] = useState(null)
  const orbit = useRef(0)
  const beam = useRef()

  const setHovered = (i) => {
    state.hoveredDoc = i
    setHoveredState(i)
  }

  useEffect(() => {
    let alive = true
    document.fonts.ready.then(() => {
      if (alive) setTextures(list.map((c, i) => drawCV(c, i)))
    })
    return () => {
      alive = false
    }
  }, [count])

  useEffect(() => () => textures?.forEach((t) => t.dispose()), [textures])

  const layout = useMemo(() => {
    const spacing = state.isMobile ? 1.0 : 1.42
    return list.map((_, i) => {
      const off = i - (list.length - 1) / 2
      return { row: new THREE.Vector3(off * spacing, Math.sin(i * 1.3) * 0.12, 1.5 - Math.abs(off) * 0.16) }
    })
  }, [count])

  useFrame((s, dt) => {
    const scan = local('scan')
    const k = smoother(range(scan, 0.02, 0.3)) // orbit -> row
    const b = range(scan, 0.32, 0.72) // beam sweep
    const suck = smoother(range(scan, 0.8, 0.98)) // pulled into the core
    const priv = smoother(range(local('privacy'), 0.05, 0.45)) // come back, masked
    const rowHalf = ((list.length - 1) / 2) * (state.isMobile ? 1.0 : 1.42) + 1
    const beamX = THREE.MathUtils.lerp(-rowHalf, rowHalf, b)

    // Orbit spins slowly; dragging adds momentum
    state.drag.velocity *= Math.pow(0.04, dt)
    orbit.current += dt * (state.reducedMotion ? 0.02 : 0.07) + state.drag.velocity * dt
    // In the privacy section the masked CVs orbit tighter around the core "shield"
    const radius = THREE.MathUtils.lerp(state.isMobile ? 3.0 : 3.75, 2.75, suck > 0.99 ? priv : 0)
    const t = s.clock.elapsedTime

    if (beam.current) {
      const on = b > 0 && b < 1 ? 1 : 0
      beam.current.position.x = beamX
      easing.damp(beam.current.material, 'opacity', on * 0.9, 0.12, dt)
      beam.current.visible = beam.current.material.opacity > 0.01
    }

    list.forEach((_, i) => {
      const r = refs.current[i]
      if (!r?.group) return
      const a = (i / list.length) * Math.PI * 2 + orbit.current
      const orbitPos = v.set(Math.cos(a) * radius, Math.sin(i * 2.1 + t * 0.6) * 0.75, Math.sin(a) * radius * 0.8)
      const pos = orbitPos.clone().lerp(layout[i].row, k)
      // pulled into the core, then (privacy) released back to the orbit
      pos.lerp(ORIGIN, suck)
      if (suck > 0.99 && priv > 0) pos.copy(orbitPos).multiplyScalar(priv)

      const hoverAmt = hovered === i ? 1 : 0
      r.interactive = (k < 0.05 && suck < 0.05) || priv > 0.9
      if (hoverAmt) pos.add(orbitPos.clone().normalize().multiplyScalar(0.35))

      // Face (mostly) towards the viewer, with a gentle fan
      dummy.position.copy(pos)
      dummy.lookAt(pos.x * 0.35, pos.y * 0.35, 14)
      q.copy(dummy.quaternion)
      if (k > 0) {
        dummy.lookAt(pos.x, pos.y, 20)
        q.slerp(dummy.quaternion, k)
      }
      easing.damp3(r.group.position, pos, hoverAmt ? 0.12 : 0.08, dt)
      easing.dampQ(r.group.quaternion, q, 0.12, dt)

      // spin on click + float wobble
      const spinTarget = (r.spin || 0) + suck * Math.PI * 3
      r.spinNow = r.spinNow ?? 0
      r.spinNow = THREE.MathUtils.damp(r.spinNow, spinTarget, 4, dt)
      r.inner.rotation.set(Math.sin(t * 0.7 + i) * 0.05, r.spinNow, Math.cos(t * 0.5 + i) * 0.04)

      const show = suck < 0.995 || (priv > 0.01 && local('cta') < 0.36)
      const ctaFade = 1 - smoother(range(local('cta'), 0.0, 0.35))
      const scale = (state.isMobile ? 0.72 : 1) * (suck > 0.99 ? priv * ctaFade * 0.72 : 1 - suck * 0.95) * (1 + hoverAmt * 0.07)
      r.group.visible = show
      r.group.scale.setScalar(Math.max(0.0001, scale))

      // Redaction: as the beam passes over each document (and always once masked)
      const docX = r.group.position.x
      const red = Math.max(range(beamX, docX - 0.7, docX + 0.5) * (b > 0 ? 1 : 0), suck > 0.99 ? priv : 0, k > 0.99 && b >= 1 ? 1 : 0)
      r.redact.current.forEach((m, kk) => {
        if (!m) return
        const target = Math.max(0.0001, range(red, kk * 0.15, 0.6 + kk * 0.15))
        m.scale.x = THREE.MathUtils.damp(m.scale.x, target, 10, dt)
        m.position.x = (m.geometry.parameters.width * m.scale.x) / 2
      })
    })
  })

  if (!textures) return null
  return (
    <group>
      {list.map((c, i) => (
        <DocCard key={i} c={c} i={i} texture={textures[i]} refs={refs} hovered={hovered} setHovered={setHovered} />
      ))}
      {/* Scanning beam for the blind-screening stage */}
      <mesh ref={beam} position={[0, 0, 1.65]} visible={false}>
        <planeGeometry args={[0.06, 2.6]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  )
}
