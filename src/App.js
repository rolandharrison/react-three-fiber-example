import React, { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from 'react-three-fiber'
import './App.css'
import Camera from './components/Camera'
import Particles from './components/Particles'
import Box from './components/Box'
import RenderEffects from './components/RenderEffects'

function App() {
  return (
    <div className="app">
      <Canvas
        concurrent
        pixelRatio={window.devicePixelRatio}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#1D2224'))
        }}>
        <Camera />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Particles size={[256, 256]} />
          {/* <Box position={[-1.2, 0, 0]} /> */}
          {/* <Box position={[1.2, 0, 0]} /> */}
          <RenderEffects />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
