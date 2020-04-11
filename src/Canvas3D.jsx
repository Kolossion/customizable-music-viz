import React, { useMemo } from 'react';
import {vertex_shader, fragment_shader } from './shaders'
import { Canvas } from 'react-three-fiber'
import Cloud from './Cloud'
import ViewControls from './ViewControls'

export default function Canvas3D(props) {

  const v_shader = useMemo(() => ( vertex_shader(props.f, props.shaderFunc) ), [props.f, props.shaderFunc])

  return <Canvas 
    style={{ height: '100vh' }}
    camera={{position:[0, 0, 2]}} 
    gl={{ alpha: false, antialias: false, powerPreference: props.highPerformance ? 'high-performance' : 'default', }}
  >
    <Cloud  {...props}
            audioCtx={props.audioCtx}
            track={props.track}
            particleCount={props.numParticles}
            fft={Math.pow(2, 14)}
            v_shader={v_shader}
            f_shader={fragment_shader()}
    />
    <ViewControls />
  </Canvas>
}