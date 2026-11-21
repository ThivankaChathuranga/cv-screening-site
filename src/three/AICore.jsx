import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import { simplex3 } from './shaders'
import { local, range, state } from '../state'
import { COLORS } from '../config'

const coreVertex = /* glsl */ `
uniform float uTime; uniform float uPulse;
varying vec3 vNormal; varying vec3 vPos; varying float vNoise;
${simplex3}
void main(){
  vNormal = normalize(normalMatrix * normal);
  float n = snoise(position * 2.2 + uTime * 0.35);
  float n2 = snoise(position * 5.0 - uTime * 0.6) * 0.35;
  vNoise = n + n2;
  vec3 p = position + normal * (vNoise * 0.07 + uPulse * 0.12);
  vPos = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`

const coreFragment = /* glsl */ `
uniform float uTime; uniform float uPulse; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
varying vec3 vNormal; varying vec3 vPos; varying float vNoise;
void main(){
  float fres = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.2);
  float bands = 0.5 + 0.5 * sin(vNoise * 7.0 + uTime * 1.4);
  vec3 col = mix(uA, uB, bands);
  col = mix(col, uC, smoothstep(0.35, 1.0, vNoise));
  float glow = 1.4 + fres * 2.8 + uPulse * 3.0;
  gl_FragColor = vec4(col * glow, 1.0);
}`

function Ring({ radius, tube, color, speed, tilt, dots = 3 }) {
  const ref = useRef()
  useFrame((_, dt) => {
    ref.current.rotation.z += dt * speed
  })
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <torusGeometry args={[radius, tube, 16, 220]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
        </mesh>
        {Array.from({ length: dots }).map((_, i) => {
          const a = (i / dots) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[tube * 3.2, 16, 16]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

export function AICore({ highQuality }) {
  const group = useRef()
  const glass = useRef()
  const inner = useRef()
  const coreMat = useRef()
  const [hovered, setHovered] = useState(false)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uA: { value: new THREE.Color(COLORS.blue) },
      uB: { value: new THREE.Color(COLORS.cyan) },
      uC: { value: new THREE.Color(COLORS.violet) },
    }),
    []
  )

  useFrame((s, dt) => {
    const u = coreMat.current?.uniforms
    // Click pulse decays smoothly
    state.pulse = Math.max(0, state.pulse - dt * 1.4)
    if (u) {
      u.uTime.value += dt
      u.uPulse.value = state.pulse
    }

    // Core grows slightly in the privacy section (becomes the "shield")
    const shield = range(local('privacy'), 0.15, 0.5) * (1 - range(local('privacy'), 0.85, 1))
    const target = 1 + (hovered ? 0.06 : 0) + shield * 0.1 + state.pulse * 0.1
    easing.damp3(group.current.scale, [target, target, target], 0.25, dt)

    // Follow the pointer a little, plus slow idle rotation
    const g = group.current
    easing.dampE(
      g.rotation,
      [state.pointer.y * 0.35, s.clock.elapsedTime * 0.15 + state.pointer.x * 0.5, 0],
      0.6,
      dt
    )
    inner.current.rotation.y -= dt * 0.25
  })

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        state.pulse = 1
      }}
    >
      {/* Glass shell */}
      <mesh ref={glass} castShadow>
        <icosahedronGeometry args={[1.25, 20]} />
        {highQuality ? (
          <MeshTransmissionMaterial
            samples={6}
            resolution={512}
            thickness={1.1}
            roughness={0.04}
            ior={1.35}
            chromaticAberration={0.08}
            anisotropicBlur={0.15}
            distortion={0.35}
            distortionScale={0.35}
            temporalDistortion={0.12}
            backside
            backsideThickness={0.4}
            color="#dfeaff"
            attenuationDistance={2.5}
            attenuationColor="#9fd2ff"
          />
        ) : (
          <meshPhysicalMaterial
            transmission={1}
            thickness={1}
            roughness={0.08}
            ior={1.35}
            color="#dfeaff"
            transparent
            opacity={0.9}
          />
        )}
      </mesh>

      {/* Glowing neural core */}
      <mesh ref={inner} scale={0.58}>
        <icosahedronGeometry args={[1, 48]} />
        <shaderMaterial
          ref={coreMat}
          vertexShader={coreVertex}
          fragmentShader={coreFragment}
          uniforms={uniforms}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={COLORS.cyan} intensity={18} distance={7} decay={2} />

      <Ring radius={1.75} tube={0.006} color={COLORS.cyan} speed={0.35} tilt={[1.2, 0.2, 0]} />
      <Ring radius={2.05} tube={0.005} color={COLORS.violet} speed={-0.25} tilt={[0.3, 1.1, 0.4]} dots={2} />
      <Ring radius={2.4} tube={0.004} color={COLORS.blue} speed={0.18} tilt={[-0.6, 0.4, 1.2]} dots={4} />
    </group>
  )
}
