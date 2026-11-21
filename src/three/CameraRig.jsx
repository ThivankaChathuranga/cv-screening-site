import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import { smoother, state } from '../state'

// One camera shot per page section: where the camera sits and what it looks at.
// The camera flies between these shots along Catmull-Rom splines as you scroll.
const SHOTS = [
  { stage: 'hero', pos: [0, 0.25, 9.6], target: [0, 0, 0], shiftX: -2.7, mobileY: -2.4 },
  { stage: 'scan', pos: [-3.8, 1.7, 9.4], target: [0.6, 0, 1.0] },
  { stage: 'embed', pos: [7.6, 3.8, -9.8], target: [0, 0, -18], shiftX: -3.2 },
  { stage: 'rank', pos: [-6.4, 4.6, -25.6], target: [0.3, 2.1, -36], shiftX: -2.6, mobileY: -3.2 },
  { stage: 'results', pos: [6.4, 3.0, -28.4], target: [0, 1.9, -36] },
  { stage: 'privacy', pos: [3.6, 1.6, 9.2], target: [0, 0, 0], shiftX: -3.0 },
  { stage: 'cta', pos: [13, 15, 9], target: [0, -2, -17] },
]

const tmpPos = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()
const lookAt = new THREE.Vector3()

export function CameraRig() {
  const { camera, size } = useThree()
  const look = useRef(new THREE.Vector3(0, 0, 0))

  // On wide screens, some shots slide the scene sideways so text and 3D don't collide
  const wide = size.width / size.height >= 1.05
  const curves = useMemo(() => {
    const shift = (v, s) =>
      new THREE.Vector3(v[0] + (wide ? s.shiftX || 0 : 0), v[1] + (wide ? 0 : s.mobileY || 0), v[2])
    const p = new THREE.CatmullRomCurve3(SHOTS.map((s) => shift(s.pos, s)), false, 'centripetal')
    const t = new THREE.CatmullRomCurve3(SHOTS.map((s) => shift(s.target, s)), false, 'centripetal')
    return { p, t }
  }, [wide])

  useFrame((_, dt) => {
    // Scroll position of each shot = where its section is centred on screen
    const anchors = SHOTS.map((s) => {
      const sec = state.sections[s.stage]
      return sec ? sec.top + sec.height / 2 - state.vh / 2 : 0
    })
    const y = state.scrollY
    let i = 0
    while (i < anchors.length - 2 && y > anchors[i + 1]) i++
    const span = Math.max(1, anchors[i + 1] - anchors[i])
    const t = smoother(Math.min(1, Math.max(0, (y - anchors[i]) / span)))
    const u = (i + t) / (SHOTS.length - 1)

    curves.p.getPoint(u, tmpPos)
    curves.t.getPoint(u, tmpTarget)

    // Portrait screens: pull the camera back so the scene still fits
    const aspect = size.width / size.height
    const pullBack = aspect < 0.8 ? 1.65 : aspect < 1.2 ? 1.25 : 1
    tmpPos.sub(tmpTarget).multiplyScalar(pullBack).add(tmpTarget)

    // Subtle parallax that follows the pointer
    const par = state.reducedMotion ? 0 : 1
    tmpPos.x += state.pointer.x * 0.7 * par
    tmpPos.y += state.pointer.y * 0.4 * par

    easing.damp3(camera.position, tmpPos, 0.35, dt)
    easing.damp3(look.current, tmpTarget, 0.3, dt)
    lookAt.copy(look.current)
    camera.lookAt(lookAt)
  })

  return null
}
