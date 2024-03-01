import React, { useRef, useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { extend, useThree, useFrame } from 'react-three-fiber'

extend({ OrbitControls })

export default function MyControls(props) {
  const { camera, gl } = useThree()
  const orbitControls = useRef()

  useFrame((state) => {
    orbitControls.current.update()
  })

  useEffect(() => {
    // orbitControls.autoRotate = props.autoRotate
  }, [props.autoRotate])

  return (
    <orbitControls ref={orbitControls} args={[camera, gl.domElement]} autoRotate={true} autoRotateSpeed={props.autoRotateSpeed} enableZoom={true} />
  )
}