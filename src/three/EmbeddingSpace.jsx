import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { local, near, range, smoother, state } from '../state'
import { COLORS } from '../config'

export const EMBED_CENTER = [0, 0, -18]

const CLUSTERS = [
  { label: 'HR & People', color: COLORS.mint, center: [-2.6, 0.9, 0.6] },
  { label: 'Data & Analytics', color: COLORS.cyan, center: [2.7, 1.4, -0.8] },
  { label: 'Engineering', color: COLORS.blue, center: [0.6, -1.9, 1.8] },
  { label: 'Quality', color: COLORS.violet, center: [2.4, -1.2, -2.6] },
  { label: 'Finance', color: COLORS.amber, center: [-2.2, -1.4, -2.4] },
]

const vertex = /* glsl */ `
uniform float uTime; uniform float uMorph; uniform float uSize; uniform float uReveal;
attribute vec3 aCluster; attribute vec3 aColor; attribute float aSeed;
varying vec3 vColor; varying float vAlpha;
void main(){
  float m = smoothstep(0.0, 1.0, clamp(uMorph * 1.25 - aSeed * 0.25, 0.0, 1.0));
  vec3 p = mix(position, aCluster, m);
  p += 0.06 * vec3(sin(uTime*0.7 + aSeed*40.0), cos(uTime*0.6 + aSeed*30.0), sin(uTime*0.5 + aSeed*20.0));
  vColor = mix(vec3(0.55, 0.65, 0.85), aColor, m);
  float tw = 0.65 + 0.35 * sin(uTime * 2.0 + aSeed * 60.0);
  vAlpha = uReveal * tw;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.6 + aSeed * 0.8) / -mv.z;
}`

const fragment = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float core = smoothstep(0.5, 0.0, d);
  float a = core * core;
  gl_FragColor = vec4(vColor * (1.4 + core * 1.6), a * vAlpha);
}`

function gauss() {
  // Box-Muller
  const u = 1 - Math.random()
  const v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function EmbeddingSpace({ count = 2600 }) {
  const group = useRef()
  const lines = useRef([])
  const labels = useRef([])
  const star = useRef()
  const mat = useRef()

  const { geometry, jd, matches } = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const clu = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const c = new THREE.Color()
    const hrPoints = []
    for (let i = 0; i < count; i++) {
      // random start inside a sphere
      const r = 8 * Math.cbrt(Math.random())
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.7, r * Math.sin(ph) * Math.sin(th)], i * 3)
      const k = i % CLUSTERS.length
      const cc = CLUSTERS[k].center
      const spread = 0.62
      const p = [cc[0] + gauss() * spread, cc[1] + gauss() * spread * 0.8, cc[2] + gauss() * spread]
      clu.set(p, i * 3)
      c.set(CLUSTERS[k].color)
      col.set([c.r, c.g, c.b], i * 3)
      seed[i] = Math.random()
      if (k === 0) hrPoints.push(p)
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aCluster', new THREE.BufferAttribute(clu, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10)

    // The job description lands in the HR cluster; its 6 nearest CVs are the top matches
    const jd = new THREE.Vector3(...CLUSTERS[0].center).add(new THREE.Vector3(0.35, 0.25, 0.3))
    const matches = hrPoints
      .map((p) => new THREE.Vector3(...p))
      .sort((a, b) => a.distanceTo(jd) - b.distanceTo(jd))
      .slice(3, 9)
    return { geometry: g, jd, matches }
  }, [count])

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uMorph: { value: 0 }, uSize: { value: 110 }, uReveal: { value: 0 } }),
    []
  )

  useFrame((s, dt) => {
    const visible = near('embed', 1.2) || near('privacy', 0.6) || near('results', 1) || near('cta', 1)
    group.current.visible = visible
    if (!visible) return
    const e = local('embed')
    const morph = smoother(range(e, 0.05, 0.55))
    const link = smoother(range(e, 0.5, 0.75))
    const u = mat.current.uniforms
    u.uTime.value += dt
    u.uMorph.value = morph
    u.uReveal.value = THREE.MathUtils.damp(u.uReveal.value, 1, 2, dt)
    u.uSize.value = state.isMobile ? 80 : 110
    group.current.rotation.y += dt * (state.reducedMotion ? 0.01 : 0.04)

    lines.current.forEach((l, i) => {
      if (!l) return
      const a = range(link, i * 0.08, 0.5 + i * 0.08)
      l.material.opacity = a * 0.9
      l.material.dashOffset -= dt * 0.6
      l.visible = a > 0.01
    })
    if (star.current) {
      const pulse = 1 + Math.sin(s.clock.elapsedTime * 3) * 0.15
      star.current.scale.setScalar((0.12 + link * 0.06) * pulse * (0.3 + morph * 0.7))
    }
    labels.current.forEach((el) => {
      if (el) el.style.opacity = String(range(e, 0.45, 0.6) * (1 - range(e, 0.92, 1)))
    })
  })

  return (
    <group ref={group} position={EMBED_CENTER}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      {/* The job description */}
      <mesh ref={star} position={jd}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <pointLight position={jd} color={COLORS.mint} intensity={6} distance={4} />
      {matches.map((m, i) => (
        <Line
          key={i}
          ref={(el) => (lines.current[i] = el)}
          points={[jd, m]}
          color={COLORS.mint}
          lineWidth={1.6}
          dashed
          dashSize={0.12}
          gapSize={0.08}
          transparent
          opacity={0}
          toneMapped={false}
        />
      ))}

      {!state.isMobile &&
        CLUSTERS.map((c, i) => (
          <Html key={c.label} position={[c.center[0], c.center[1] + 1.25, c.center[2]]} center zIndexRange={[10, 0]}>
            <div ref={(el) => (labels.current[i] = el)} className="cluster-label" style={{ opacity: 0 }}>
              <span style={{ background: c.color }} />
              {c.label}
            </div>
          </Html>
        ))}
    </group>
  )
}
