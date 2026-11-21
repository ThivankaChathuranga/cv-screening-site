import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { Dust } from './Dust'
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { CameraRig } from './CameraRig'
import { AICore } from './AICore'
import { Documents } from './Documents'
import { DataStream } from './DataStream'
import { EmbeddingSpace } from './EmbeddingSpace'
import { RankingTowers } from './RankingTowers'
import { near, state } from '../state'
import { COLORS } from '../config'

function HeroStage({ high }) {
  const group = useRef()
  useFrame(() => {
    // Skip rendering the hero objects when the camera is far away
    group.current.visible = near('hero', 2.5) || near('scan', 1) || near('privacy', 1.2) || near('cta', 1.5)
  })
  return (
    <group ref={group}>
      <AICore highQuality={high} />
      <Documents count={state.isMobile ? 7 : 10} />
      <DataStream count={high ? 4200 : 1800} />
      <ContactShadows position={[0, -2.6, 0]} opacity={0.55} scale={16} blur={2.6} far={5} resolution={512} color="#000814" frames={Infinity} />
      {/* key + rim lights for the hero */}
      <spotLight position={[5, 7, 7]} angle={0.45} penumbra={1} intensity={120} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0003} />
      <spotLight position={[-7, -2, -4]} angle={0.6} penumbra={1} intensity={70} color={COLORS.violet} />
      <pointLight position={[-4, 3, 4]} intensity={8} color={COLORS.blue} />
    </group>
  )
}

// Guard every built-in material: a single NaN/Infinity pixel would otherwise be
// spread over the whole screen by the bloom pass and turn the frame black.
// Also cap HDR brightness: values above the half-float limit (65504) become Infinity in the
// bloom buffers and then NaN. 64 is far above anything the bloom threshold needs.
const NAN_GUARD = '\ngl_FragColor = (any(isnan(gl_FragColor)) || any(isinf(gl_FragColor))) ? vec4(0.0, 0.0, 0.0, 1.0) : clamp(gl_FragColor, 0.0, 64.0);'
if (!THREE.ShaderChunk.dithering_fragment.includes('isnan')) THREE.ShaderChunk.dithering_fragment += NAN_GUARD

// ?record keeps full quality for frame-by-frame video capture
const PARAMS = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams()
const RECORD = PARAMS.has('record')
const FX = PARAMS.get('fx') // debug: comma list of effects to keep

export function Experience({ onReady }) {
  const [high, setHigh] = useState(!state.isMobile)
  const { gl } = useThree()
  const frames = useRef(0)

  useFrame(() => {
    // Tell the page the scene has rendered a few frames (shaders compiled)
    if (frames.current < 4 && ++frames.current === 4) onReady?.()
  })

  return (
    <>
      {!RECORD && <PerformanceMonitor
        onDecline={() => {
          setHigh(false)
          state.quality = 'low'
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.1))
        }}
        onIncline={() => {
          if (!state.isMobile) {
            setHigh(true)
            state.quality = 'high'
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
          }
        }}
        flipflops={3}
      />}

      <color attach="background" args={[COLORS.bg]} />
      <fog attach="fog" args={[COLORS.bg, 16, 48]} />
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#9fc4ff', '#0a0f1c', 0.35]} />

      {/* Procedural studio environment: soft-box reflections without loading HDR files */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -9]} scale={[10, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-6, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} color={COLORS.cyan} />
        <Lightformer form="rect" intensity={2} position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} color={COLORS.violet} />
        <Lightformer form="ring" intensity={4} position={[0, 6, 6]} scale={3} color="#ffffff" />
      </Environment>

      <CameraRig />
      <HeroStage high={high} />
      <EmbeddingSpace count={high ? 2600 : 1200} />
      <RankingTowers highQuality={high} />

      {/* Floating dust across the whole journey */}
      <Dust count={high ? 260 : 100} color={COLORS.cyan} />

      {FX !== 'off' && (
        <EffectComposer multisampling={0} enableNormalPass={false} frameBufferType={PARAMS.get('fb') === 'float' ? THREE.FloatType : THREE.HalfFloatType}>
          {(!FX || FX.includes('bloom')) && <Bloom mipmapBlur={!PARAMS.has('nomip')} intensity={high ? 0.85 : 0.6} luminanceThreshold={0.82} luminanceSmoothing={0.2} radius={0.75} />}
          {(!FX || FX.includes('vignette')) && <Vignette offset={0.25} darkness={0.75} />}
          {(!FX || FX.includes('noise')) && <Noise opacity={0.035} premultiply />}
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </>
  )
}
