import React, { useRef, useMemo, useState } from 'react';
import Cloud from './Cloud'
import ViewControls from './ViewControls'
import {vertex_shader, fragment_shader, DEFAULT_FUNC, DEFAULT_F} from './shaders'
import { Canvas } from 'react-three-fiber'
import Slider from 'rc-slider'
import { ArrowLeft, ArrowRight } from 'react-feather'
import 'rc-slider/assets/index.css'

export default function FunctionViewer(props) {
  const [shaderFunc, setShaderFunc] = useState(DEFAULT_FUNC)
  const [f, setF] = useState(DEFAULT_F)
  const [numParticles, setNumParticles] = useState(1000)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const v_shader = useMemo(() => ( vertex_shader(f, shaderFunc) ), [f, shaderFunc])

  const setShaderFuncText = (e) => {
    setShaderFunc(e.target.value)
  }

  const setFText = (e) => {
    setF(e.target.value)
  }

  const changeParticleCount = (val) => {
    console.log("SOME MATH", Math.pow(1_000_000, val))
    setNumParticles(Math.round(Math.pow(1_000_000, val)))
  }


  return (
    <>
      <div className={"sidebar " + (!sidebarOpen ? "hidden" : "")}>
        <h2>Customize Visualizer</h2>
        <div className="drawer-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
          { sidebarOpen ?
            <ArrowRight color="#ffffff"/> :
            <ArrowLeft color="#ffffff"/>
          }
        </div>
        <label for="f-input">Value of <i>f</i></label>
        <input id="f-input" name="f-input" type="text" onChange={setFText} value={f} />
        <label for="fn-input">Shader function</label>
        <input id="fn-input" name="fn-input" type="text" onChange={setShaderFuncText} value={shaderFunc} />
        <label for="num-particles">Number of Particles: {numParticles}</label>
        <div style={{ width: '100%', padding: '10px'}}>
          <Slider id="num-particles" name="num-particles" onChange={changeParticleCount} min={0.5} max={1} step={1/1000}/>
        </div>
      </div>
      <Canvas 
        style={{ height: '100vh' }}
        camera={{position:[0, 0, 2]}} 
        gl={{ alpha: false, antialias: false, }}
      >
        <Cloud 
          audioCtx={props.audioCtx}
          track={props.track}
          particleCount={numParticles}
          fft={Math.pow(2, 14)}
          // v_shader={v_shader}
          v_shader={v_shader}
          f_shader={fragment_shader()}
        />
        <ViewControls />
      </Canvas>
    </>
  )
}
