import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { useFrame, useLoader } from 'react-three-fiber'

Particles.propTypes = {
  size: PropTypes.array.isRequired
}

function Particles(props) {
  let clock = new THREE.Clock()
  let [width, height] = props.size

  function random() {
    return Math.random() - 0.5
  }

  const vertexShader = `
      uniform float uTime;
      uniform float uWidth;
      uniform float uHeight;
      uniform sampler2D tNoise;
  
      attribute vec3 velocity;
      attribute float turbulence;
      attribute float aIndex;
  
      varying vec4 vColor;

      void main() {
        gl_PointSize = 0.4;
        vec2 uv = vec2(mod(aIndex, uWidth)/uWidth, mod(aIndex/uWidth, uHeight)/uHeight);
      
        vec3 noise = 4.0 * sin(uTime) * texture2D( tNoise, vec2( uv.x + uTime * 0.02, uv.y)).rgb;
  
        vec3 position = vec3(uv.x*16.0-8.0, 2.0 * sin(uTime * 2.0 + 4.0 * uv.x), uv.y * 10.0);
        position = position + sin(vec3(noise.rgb));
        vColor = vec4(0.003 , 0.41, 0.49, 0.8*(1.0 -uv.y));
      
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `

  const fragmentShader = `
      varying vec4 vColor;
      uniform sampler2D tSprite;
  
      void main() {
        gl_FragColor = vColor;
      }
    `

  const noiseTexture = useLoader(THREE.TextureLoader, 'perlin-512.png')

  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: false,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0.0
        },
        tNoise: {
          value: noiseTexture
        },
        uWidth: {
          value: width
        },
        uHeight: {
          value: height
        }
      },
      blending: THREE.AdditiveBlending,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })
  }, [vertexShader, fragmentShader, width, height, noiseTexture])

  const geometry = React.useMemo(() => {
    function generatePointCloudPositions(geometry, width, height) {
      let numPoints = width * height
      let positions = new Float32Array(numPoints * 3)

      let k = 0
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          let u = i / width
          let v = j / height
          let y = u - 0.5
          let x = v - 0.5
          let z = 0
          positions[3 * k] = x
          positions[3 * k + 1] = y
          positions[3 * k + 2] = z
          k++
        }
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.computeBoundingBox()
      return geometry
    }

    function generatePointCloudGeometry(width, height) {
      let geometry = new THREE.BufferGeometry()
      geometry = generatePointCloudPositions(geometry, width, height)

      let numPoints = width * height

      let indices = new Uint16Array(numPoints)
      let velocities = new Float32Array(numPoints * 3)
      let turbulence = new Float32Array(numPoints)

      let k = 0
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          indices[k] = k //Index

          velocities[k * 3 + 0] = 0.0002 * random() - 0.0001 // velocity.x
          velocities[k * 3 + 1] = Math.abs(0.0005 * random()) // velocity.y
          velocities[k * 3 + 2] = 0.0001 * random() // velocity.z

          turbulence[k] = (j / height) * 2.0

          k++
        }
      }

      geometry.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1))
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
      geometry.setAttribute('turbulence', new THREE.BufferAttribute(turbulence, 1))
      return geometry
    }

    return generatePointCloudGeometry(width, height)
  }, [width, height])

  useFrame(() => {
    material.uniforms.uTime.value = clock.getElapsedTime() * 0.1
  })

  return <points material={material} geometry={geometry} />
}

export default Particles
