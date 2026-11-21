import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { local, range, smoother, state } from '../state'
import { COLORS } from '../config'

// GPU particle stream: thousands of points travel along curved paths from the
// orbiting CVs into the AI core. All motion is computed in the vertex shader.
const vertex = /* glsl */ `
uniform float uTime; uniform float uFlow; uniform float uSize; uniform float uPulse;
attribute vec3 aStart; attribute vec3 aCtrl; attribute float aSeed; attribute float aSpeed;
varying float vT; varying float vAlpha;
vec3 bezier(vec3 a, vec3 b, vec3 c, float t){ float u = 1.0 - t; return u*u*a + 2.0*u*t*b + t*t*c; }
void main(){
  float t = fract(uTime * aSpeed + aSeed);
  vec3 p = bezier(aStart, aCtrl, vec3(0.0), t);
  // swirl around the core as particles get closer
  float ang = t * t * 2.4;
  p.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * p.xz;
  p += normalize(p + 0.0001) * uPulse * 1.5 * (1.0 - t);
  vT = t;
  vAlpha = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(0.82, 1.0, t)) * uFlow;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.45 + 0.9 * (1.0 - t)) * (1.0 / -mv.z);
}`

const fragment = /* glsl */ `
uniform vec3 uA; uniform vec3 uB;
varying float vT; varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a = a * a;
  vec3 col = mix(uA, uB, vT) * 2.2;
  gl_FragColor = vec4(col, a * vAlpha);
}`

export function DataStream({ count = 4000 }) {
  const mat = useRef()

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const start = new Float32Array(count * 3)
    const ctrl = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const speed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 3.2 + Math.random() * 2.2
      const y = (Math.random() - 0.5) * 2.4
      start.set([Math.cos(a) * r, y, Math.sin(a) * r * 0.8], i * 3)
      const ca = a + 0.9 + Math.random() * 0.6
      const cr = r * 0.55
      ctrl.set([Math.cos(ca) * cr, y * 0.4 + (Math.random() - 0.5), Math.sin(ca) * cr], i * 3)
      seed[i] = Math.random()
      speed[i] = 0.08 + Math.random() * 0.12
    }
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aStart', new THREE.BufferAttribute(start, 3))
    g.setAttribute('aCtrl', new THREE.BufferAttribute(ctrl, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 7)
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlow: { value: 1 },
      uPulse: { value: 0 },
      uSize: { value: 70 },
      uA: { value: new THREE.Color(COLORS.blue) },
      uB: { value: new THREE.Color(COLORS.cyan) },
    }),
    []
  )

  useFrame((_, dt) => {
    const u = mat.current?.uniforms
    if (!u) return
    const scan = local('scan')
    // Flow is calm in the hero, surges when CVs are pulled into the core
    const surge = range(scan, 0.75, 0.95) * (1 - range(scan, 0.97, 1))
    const fade = 1 - smoother(range(scan, 0.98, 1)) * (1 - range(local('privacy'), 0.1, 0.4))
    u.uTime.value += dt * (1 + surge * 3) * (state.reducedMotion ? 0.3 : 1)
    u.uFlow.value = THREE.MathUtils.damp(u.uFlow.value, (0.55 + surge * 0.45) * fade, 4, dt)
    u.uPulse.value = state.pulse
    u.uSize.value = state.isMobile ? 55 : 70
  })

  return (
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
  )
}
