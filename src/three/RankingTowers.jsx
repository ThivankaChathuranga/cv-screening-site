import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Html, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { easeOutExpo, local, near, range, state } from '../state'
import { COLORS } from '../config'

export const RANK_CENTER = [0, 0, -36]
const BAND = { Shortlist: COLORS.mint, Review: COLORS.amber, Reject: COLORS.coral }

const ROWS = [
  { id: 'C04', score: 82, band: 'Shortlist' },
  { id: 'C11', score: 68, band: 'Shortlist' },
  { id: 'C17', score: 68, band: 'Shortlist' },
  { id: 'C02', score: 61, band: 'Review' },
  { id: 'C09', score: 52, band: 'Review' },
  { id: 'C13', score: 44, band: 'Review' },
  { id: 'C06', score: 33, band: 'Reject' },
  { id: 'C20', score: 21, band: 'Reject' },
]
const MAX_H = 4.6

function Tower({ row, i, x, refs }) {
  const color = BAND[row.band]
  return (
    <group position={[x, 0, Math.abs(i - 3.5) * 0.25]} ref={(el) => (refs.current[i] = { ...(refs.current[i] || {}), group: el })}>
      <mesh
        castShadow
        receiveShadow
        ref={(el) => (refs.current[i] = { ...(refs.current[i] || {}), body: el })}
        position={[0, 0.5, 0]}
      >
        <boxGeometry args={[0.72, 1, 0.72]} />
        <meshPhysicalMaterial
          color="#0e1626"
          metalness={0.35}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={color}
          emissiveIntensity={0.06}
        />
        <Edges threshold={15} color={color} toneMapped={false} />
      </mesh>
      <mesh ref={(el) => (refs.current[i] = { ...(refs.current[i] || {}), cap: el })} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.9} />
      </mesh>
      <group ref={(el) => (refs.current[i] = { ...(refs.current[i] || {}), label: el })} visible={!state.isMobile}>
        {!state.isMobile && <Html center zIndexRange={[10, 0]}>
          <div className="tower-label" style={{ opacity: 0 }} ref={(el) => (refs.current[i] = { ...(refs.current[i] || {}), labelEl: el })}>
            <b>{row.score}</b>
            <span>{row.id}</span>
          </div>
        </Html>}
      </group>
    </group>
  )
}

export function RankingTowers({ highQuality }) {
  const group = useRef()
  const refs = useRef([])
  const target = useRef()
  const lights = useRef([])
  const spacing = 1.15

  // Lights inside a moved group must aim at an object in that group
  useEffect(() => {
    lights.current.forEach((l) => l && (l.target = target.current))
  }, [])

  useFrame((s, dt) => {
    const rank = state.sections.rank
    const started = rank ? state.scrollY + state.vh * 0.9 > rank.top : false
    const visible = started && (near('rank', 0.6) || near('results', 1.1) || near('cta', 1))
    group.current.visible = visible
    if (!visible) {
      refs.current.forEach((t) => t?.labelEl && (t.labelEl.style.opacity = '0'))
      return
    }
    const r = Math.max(local('rank'), local('results') > 0 ? 1 : 0)
    ROWS.forEach((row, i) => {
      const t = refs.current[i]
      if (!t?.body) return
      const grow = easeOutExpo(range(r, 0.12 + i * 0.045, 0.45 + i * 0.045))
      const h = Math.max(0.02, (row.score / 100) * MAX_H * grow)
      t.body.scale.y = h
      t.body.position.y = h / 2
      t.cap.position.y = h + 0.002
      if (t.label) t.label.position.y = h + 0.45
      if (t.labelEl) t.labelEl.style.opacity = String(range(grow, 0.6, 1) * (1 - range(local('cta'), 0, 0.2)))
    })
  })

  return (
    <group ref={group} position={RANK_CENTER}>
      {ROWS.map((row, i) => (
        <Tower key={row.id} row={row} i={i} x={(i - (ROWS.length - 1) / 2) * spacing} refs={refs} />
      ))}

      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        {highQuality ? (
          <MeshReflectorMaterial
            blur={[400, 120]}
            resolution={1024}
            mixBlur={1}
            mixStrength={28}
            roughness={0.9}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#060a12"
            metalness={0.6}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial color="#070b13" roughness={0.5} metalness={0.5} />
        )}
      </mesh>
      {/* Grid lines for scale */}
      <gridHelper args={[22, 22, '#1b2a44', '#0f1828']} position={[0, 0.003, 0]} />

      {/* Key light with soft shadows for this stage */}
      <object3D ref={target} position={[0, 1, 0]} />
      <directionalLight
        ref={(el) => (lights.current[0] = el)}
        position={[6, 11, 7]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <spotLight ref={(el) => (lights.current[1] = el)} position={[-7, 6, -4]} angle={0.5} penumbra={1} intensity={60} color={COLORS.violet} />
      <spotLight ref={(el) => (lights.current[2] = el)} position={[7, 5, 3]} angle={0.6} penumbra={1} intensity={40} color={COLORS.cyan} />
    </group>
  )
}
