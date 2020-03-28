import React from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { extend, useThree } from 'react-three-fiber'

extend({ OrbitControls })

export default function MyControls(props) {
  const { camera, gl } = useThree();

  return (
    <orbitControls args={[camera, gl.domElement]} enableZoom={true} />
  )
}