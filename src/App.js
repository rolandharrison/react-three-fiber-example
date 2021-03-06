import React, { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from 'react-three-fiber'
import Camera from './components/Camera'
import Particles from './components/Particles'
import RenderEffects from './components/RenderEffects'
import './App.css'

function App() {
  return (
    <div className="app">
      <Canvas
        concurrent
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#000000'))
        }}>
        <Camera position={[0, 1, 12]} lookAt={[0, 0, 0]} />
        <Suspense fallback={null}>
          <Particles size={[256, 256]} />
          <RenderEffects />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
