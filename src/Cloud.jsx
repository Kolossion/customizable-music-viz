import React, { useRef, useMemo } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

function createTranslateArray(shape, size) {
  const array = new Float32Array(3*size);
  for (let i = 0; i < size; i++) {
    array[i*3] = Math.random() * 40 - 20;

    if (shape !== 'line')
      array[i*3+2] = Math.random() * 40 - 20;

    if (shape === 'cloud')
      array[i*3+1] = Math.random() * 40 - 20;
  }

  return array;
}

export default function Cloud(props) {
  const mesh = useRef()

  const [amplitudeArray, analyserNode, audioTexture] = useMemo((fftSize = props.fft) => {
    const analyserNode = props.audioCtx.createAnalyser();
    analyserNode.fftSize = fftSize;
    // analyserNode.fftSize = Math.pow(2, 14);
    props.track.connect(analyserNode);
    const amplitudeArray = new Uint8Array(analyserNode.frequencyBinCount);
    const texture = new THREE.DataTexture(amplitudeArray, fftSize / 2, 1, THREE.LuminanceFormat );

    return [amplitudeArray, analyserNode, texture];
  }, [props.audioCtx, props.fft, props.track])


  const circleTexture = useMemo(() => new THREE.TextureLoader().load('https://i.postimg.cc/W1CMqD6N/circle.png'), []);
  const indexes = useMemo(() => new THREE.CircleBufferGeometry(1, 6).index);

  const attributes = useMemo((shape = props.shape, count = props.particleCount) => {
    const newAttributes = new THREE.CircleBufferGeometry(1, 6).attributes;
    const translateArray = createTranslateArray(shape, count);
    const translateAttr  = new THREE.InstancedBufferAttribute(translateArray, 3);
    newAttributes.translate = translateAttr
    newAttributes.translate.count = count;

    return newAttributes;
  }, [props.shape, props.particleCount]);

  useFrame((state) => {
    props.stats.update()
    analyserNode.getByteFrequencyData(amplitudeArray);
    mesh.current.material.uniforms.tAudioData.value.needsUpdate = true;
    mesh.current.material.uniforms.time.value = state.clock.getElapsedTime();
  })

  return (
    <mesh ref={mesh}>
      <instancedBufferGeometry attach="geometry" index={indexes} attributes={attributes} maxInstancedCount={props.particleCount} />
      <rawShaderMaterial attach="material" args={[{
        vertexShader: props.v_shader,
        fragmentShader: props.f_shader,
        uniforms: {
          time: {value: 0.0},
          map: {value: circleTexture},
          tAudioData: {value: audioTexture}
        },
        depthTest: true,
        depthWrite: true
      }]} />
    </mesh>
  )
}
