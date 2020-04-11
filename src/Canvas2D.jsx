import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { Canvas } from 'react-three-fiber'
import Plane from './Plane'
import * as THREE from 'three'

export default function Canvas2D(props) {
  

  return (
    <Canvas {...props}
            orthographic={ true }
            style={{ height: '100vh' }}
            gl={{powerPreference: props.highPerformance ? 'high-performance' : 'default'}}
            gl2 = { true }
            antialias = { true }
          >
      <Plane {...props} />
    </Canvas>
  )
}