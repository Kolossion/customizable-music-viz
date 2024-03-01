import React, { useMemo } from 'react';
import {vertex_shader, fragment_shader } from './shaders'
import { Canvas } from 'react-three-fiber'
import Cloud from './Cloud'
import ViewControls from './ViewControls'

export default function Canvas3D(props) {

  const v_shader = useMemo(() => ( vertex_shader(props.f, props.lastF, props.shaderFunc, props.lastShaderFunc, props.changeFunc) ), [props.f, props.shaderunc, props.changeFunc])

  return <Canvas 
    style={{ height: '100vh' }}
    camera={{position:[0, 0, 2]}} 
    gl={{ alpha: false, antialias: false, powerPreference: props.highPerformance ? 'high-performance' : 'default', }}
  >
    <Cloud  {...props}
            audioCtx={props.audioCtx}
            track={props.track}
            particleCount={props.numParticles}
            fftSize={props.fftSize}
            smoothingTimeConstant={props.smoothingTimeConstant}
            v_shader={v_shader}
            f_shader={fragment_shader()}
    />
    <ViewControls autoRotateSpeed={props.autoRotateSpeed} />
  </Canvas>
}