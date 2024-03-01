import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

function createTranslateArray(shape, size) {
  Math.random = (function () {
    var seed = 49734321
    return function () {
      // Robert Jenkins' 32 bit integer hash function.
      seed = seed & 0xffffffff
      seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff
      seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff
      seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff
      seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff
      seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff
      seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff
      return (seed & 0xfffffff) / 0x10000000
    }
  })();
  const array = new Float32Array(3*size);
  for (let i = 0; i < size; i++) {
    array[i*3] = Math.random() * 40 - 20;

    if (shape !== 'line')
      array[i*3+2] = Math.random() * 40 - 20;

    if (shape === 'cloud')
      array[i*3+1] = Math.random() * 40 - 20;

    if (Math.sqrt(array[i*3]**2 + array[i*3+1]**2 + array[i*3+2]**2) > 20)
      i--;
  }

  return array;
}

export default function Cloud(props) {
  const mesh = useRef()

  const [amplitudeArray, analyserNode, audioTexture] = useMemo((fftSize = props.fftSize) => {
    const analyserNode = props.audioCtx.createAnalyser();
    analyserNode.fftSize = fftSize;
    analyserNode.smoothingTimeConstant = props.smoothingTimeConstant;
    props.track.connect(analyserNode);
    const amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
    const texture = new THREE.DataTexture(amplitudeArray, fftSize / 2, 1, THREE.LuminanceFormat );

    return [amplitudeArray, analyserNode, texture];
  }, [props.audioCtx, props.fftSize, props.track, props.smoothingTimeConstant])


  const circleTexture = useMemo(() => new THREE.TextureLoader().load('https://i.postimg.cc/W1CMqD6N/circle.png'), []);
  const indexes = useMemo(() => new THREE.CircleBufferGeometry(1, 6).index);

  const attributes = useMemo((shape = props.shape, count = props.particleCount) => {
    const newAttributes = new THREE.CircleBufferGeometry(1, 6).attributes;
    const translateArray = createTranslateArray(shape, count);
    const translateAttr  = new THREE.InstancedBufferAttribute(translateArray, 3);
    newAttributes.translate = translateAttr
    newAttributes.translate.count = count;

    return newAttributes;
  }, [props.shape, props.particleCount])

  const fChangeTime = useMemo(() => {
    return mesh.current ? mesh.current.material.uniforms.time.value : 0
  }, [props.lastF])

  const funcChangeTime = useMemo(() => {
    return mesh.current ? mesh.current.material.uniforms.time.value : 0
  }, [props.shaderFunc])

  useFrame((state) => {
    // console.log(mesh.current.material.uniforms.time.value)
    analyserNode.getByteFrequencyData(amplitudeArray);
    mesh.current.material.uniforms.tAudioData.value.needsUpdate = true;
    mesh.current.material.uniforms.time.value = state.clock.getElapsedTime();
  })

  return (
    <mesh ref={mesh}>
      <instancedBufferGeometry attach="geometry" index={indexes} attributes={attributes} maxInstancedCount={props.particleCount} />
      <rawShaderMaterial attach="material" args={[{
        vertexShader: props.v_shader,
        blending: THREE.CustomBlending,
        fragmentShader: props.f_shader,
        uniforms: {
          time: {value: 0.0},
          funcChangeTime: {value: funcChangeTime},
          fChangeTime: {value: fChangeTime},
          map: {value: circleTexture},
          tAudioData: {value: audioTexture}
        },
        depthTest: true,
        depthWrite: true
      }]} />
    </mesh>
  )
}
