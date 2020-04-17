import React, { useRef } from 'react'
import * as THREE from 'three'
import { useThree } from 'react-three-fiber'

function Camera({ position, lookAt }) {
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
      position={position}
      lookAt={() => new THREE.Vector3(lookAt)}
    />
  )
}

export default Camera
