import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Ambient floating dust across the whole journey (replaces drei <Sparkles>, whose
// shader divides by the distance to the sprite centre and can emit Infinity).
const vertex = /* glsl */ `
uniform float uTime; uniform float uSize;
attribute float aSeed;
varying float vTw;
void main(){
  vec3 p = position;
  p.y += sin(uTime * 0.25 + aSeed * 30.0) * 0.4;
  p.x += cos(uTime * 0.2 + aSeed * 20.0) * 0.3;
  vTw = 0.45 + 0.55 * sin(uTime * 1.5 + aSeed * 50.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.5 + aSeed) / max(0.1, -mv.z);
}`
const fragment = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity;
varying float vTw;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(uColor * 1.6, a * a * vTw * uOpacity);
  gl_FragColor = (any(isnan(gl_FragColor)) || any(isinf(gl_FragColor))) ? vec4(0.0) : clamp(gl_FragColor, 0.0, 6.0);
}`

export function Dust({ count = 260, scale = [30, 14, 60], position = [0, 1, -16], color = '#5ef2ff', size = 60, opacity = 0.5 }) {
  const mat = useRef()
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(Math.random() - 0.5) * scale[0], (Math.random() - 0.5) * scale[1], (Math.random() - 0.5) * scale[2]], i * 3)
      seed[i] = Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: size }, uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } }),
    []
  )
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt
  })
  return (
    <points geometry={geometry} position={position} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms}
        transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  )
}
