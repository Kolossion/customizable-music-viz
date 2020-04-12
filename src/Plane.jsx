import React, { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { vertex_shader_plain, fragment_shader_2D } from './shaders'

export default function Plane(props) {
  const [zoom, setZoom] = useState(0)
  const mesh = useRef()
  const { gl, scene, camera } = useThree()

  camera.left = -.5;
  camera.right = .5;
  camera.bottom = -.5;
  camera.top = .5;
  camera.updateProjectionMatrix();
  gl.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.key === "R" && e.shiftKey) {
        const startSize = gl.getSize()
        console.log(startSize)
        gl.setSize(props.screenshotSize, props.screenshotSize)

        gl.setPixelRatio(1);
        gl.render(scene, camera)
        window.open( gl.domElement.toDataURL( 'image/png' ), 'screenshot' );
        gl.setSize(startSize.x, startSize.y)
        gl.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
      }
    }

    const wheelHandler = (e) => {
      setZoom(zoom + e.deltaY / 100)
    }

    document.addEventListener("keydown", keyDownHandler)
    document.addEventListener("wheel", wheelHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
      document.removeEventListener("wheel", wheelHandler)
    }
  }, [camera, gl, props, scene, zoom])

  useFrame((state) => {
    console.log(zoom)
    props.stats.update()
  })

  const [amplitudeArray, analyserNode, audioTexture] = useMemo((fftSize = Math.pow(2, 14)) => {
    const analyserNode = props.audioCtx.createAnalyser();
    analyserNode.fftSize = fftSize;
    props.track.connect(analyserNode);
    const amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
    const texture = new THREE.DataTexture(amplitudeArray, fftSize / 2, 1, THREE.LuminanceFormat );

    return [amplitudeArray, analyserNode, texture];
  }, [props.audioCtx, props.track])

  useFrame((state) => {
    analyserNode.getByteFrequencyData(amplitudeArray);
    mesh.current.material.uniforms.tAudioData.value.needsUpdate = true;
    mesh.current.material.uniforms.time.value = state.clock.getElapsedTime();
  })

  const convertToShaderColor = (color) => {
    const { r, g, b } = color
    return `vec4(${r / 255}, ${g / 255}, ${b / 255}, 1.0)`
  }

  return (
    <mesh
      ref={mesh}
    >
      <planeGeometry attach="geometry" />
      <shaderMaterial attach="material" args={[{
        vertexShader: vertex_shader_plain(),
        fragmentShader: fragment_shader_2D(
          props.f,
          props.shaderFunc,
          convertToShaderColor(props.colors.posColor),
          convertToShaderColor(props.colors.negColor)
        ),
        uniforms: {
          time: {value: 0.0},
          position: {value: [0.0, 0.0, 0.0]},
          tAudioData: {value: audioTexture},
          zoom: {value: zoom}
        }
      }]} />
    </mesh>
  )
}