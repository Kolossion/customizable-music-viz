import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { vertex_shader_plain, fragment_shader_2D } from './shaders'

export default function Plane(props) {
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
        gl.render(scene, camera)
        window.open( gl.domElement.toDataURL( 'image/png' ), 'screenshot' );
        gl.setSize(startSize.x, startSize.y)
        props.screenshotCallback(false)
      }
    }

    document.addEventListener("keydown", keyDownHandler)

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    }
  }, [camera, gl, props, scene])

  useFrame((state) => {
    props.stats.update()
    // if (Math.random() < 1.0) return

    // if (props.takeScreenshot) {
    //   const startSize = gl.getSize()
    //   console.log(startSize)
    //   gl.setSize(6000, 6000)
    //   gl.render(scene, camera)
    //   window.open( gl.domElement.toDataURL( 'image/png' ), 'screenshot' );
    //   gl.setSize(startSize.x, startSize.y)
    //   props.screenshotCallback(false)
    // }
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

  return (
    <mesh
      ref={mesh}
    >
      <planeGeometry attach="geometry" />
      <shaderMaterial attach="material" args={[{
        vertexShader: vertex_shader_plain(),
        fragmentShader: fragment_shader_2D(props.f, props.shaderFunc),
        uniforms: {
          time: {value: 0.0},
          position: {value: [0.0, 0.0, 0.0]},
          tAudioData: {value: audioTexture}
        }
      }]} />
    </mesh>
  )
}