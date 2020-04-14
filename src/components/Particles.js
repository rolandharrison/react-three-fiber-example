import React from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { useFrame, useLoader } from 'react-three-fiber'

const vertexShader = `
      uniform float uTime;
      uniform float uWidth;
      uniform float uHeight;
      uniform sampler2D tNoise;

      attribute float aIndex;
  
      varying vec4 vColor;

      void main() {
        gl_PointSize = 0.4;

        // Find where this vertex fits in the two-dimensional plane
        vec2 uv = vec2(mod(aIndex, uWidth)/uWidth, mod(aIndex/uWidth, uHeight)/uHeight);
        
        // Sample from the noise texture with a slow translation over time
        vec3 noise = 4.0 * sin(uTime) * texture2D( tNoise, vec2( uv.x + uTime * 0.02, uv.y)).rgb;
  
        // Stretch the points along the x-axis and oscillate along the y-axis with a sine wave
        vec3 position = vec3(uv.x*16.0-8.0, 2.0 * sin(uTime * 2.0 + 4.0 * uv.x), uv.y * 10.0);

        // Apply the noise to the position of this vertex
        position = position + sin(vec3(noise.rgb));

        // Fade the further vertices
        vColor = vec4(0.003 , 0.41, 0.49, 0.8*(1.0 -uv.y));
      
        // Apply the matrices that ThreeJS give us from the camera and model position. Transform to our new position.
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `

const fragmentShader = `
      varying vec4 vColor;
      uniform sampler2D tSprite;
  
      void main() {
        // Apply the color that we got from the vertex shader
        gl_FragColor = vColor;
      }
    `

Particles.propTypes = {
  size: PropTypes.array.isRequired
}

function Particles(props) {
  let clock = new THREE.Clock()
  let [width, height] = props.size

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
    let geometry = new THREE.BufferGeometry()
    let numPoints = width * height
    let positions = new Float32Array(numPoints * 3)
    let indices = new Uint16Array(numPoints)

    let k = 0
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        positions[3 * k] = i
        positions[3 * k + 1] = j
        positions[3 * k + 2] = 0
        indices[k] = k
        k++
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.computeBoundingBox()
    geometry.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1))
    return geometry
  }, [width, height])

  useFrame(() => {
    material.uniforms.uTime.value = clock.getElapsedTime() * 0.1
  })

  return <points material={material} geometry={geometry} />
}

export default Particles
