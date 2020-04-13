import React, { useRef } from 'react'
import * as THREE from 'three'
import { useThree } from 'react-three-fiber'

function Camera() {
  const camera = useRef()
  const { setDefaultCamera } = useThree()

  React.useEffect(() => setDefaultCamera(camera.current), [setDefaultCamera])

  return (
    <perspectiveCamera
      ref={camera}
      fov={45}
      aspect={window.innerWidth / window.innerHeight}
      near={1}
      far={10000}
      position={[0, -1.5, 10]}
      lookAt={() => new THREE.Vector3(0, 0, 0)}
    />
  )
}

export default Camera
