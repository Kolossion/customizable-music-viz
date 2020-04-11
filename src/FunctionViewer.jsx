import React, { useRef, useMemo, useState } from 'react';
import Slider from 'rc-slider'
import Stats from 'three/examples/jsm/libs/stats.module'
import { DEFAULT_FUNC, DEFAULT_F} from './shaders'
import { ArrowLeft, ArrowRight } from 'react-feather'
import Canvas3D from './Canvas3D'
import Canvas2D from './Canvas2D'
import { useFrame } from 'react-three-fiber'
import 'rc-slider/assets/index.css'

export default function FunctionViewer(props) {
  const [shaderFunc, setShaderFunc] = useState(DEFAULT_FUNC)
  const [show3D, setShow3D] = useState(true)
  const [f, setF] = useState(DEFAULT_F)
  const [highPerformance, setHighPerformance] = useState(false)
  const [numParticles, setNumParticles] = useState(1000)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const stats = new Stats();
  document.body.appendChild(stats.dom)

  const setShaderFuncText = (e) => {
    setShaderFunc(e.target.value)
  }

  const setFText = (e) => {
    setF(e.target.value)
  }

  const changeParticleCount = (val) => {
    console.log("SOME MATH", Math.pow(10_000_000, val))
    setNumParticles(Math.round(Math.pow(10_000_000, val)))
  }

  const setShow3DToggle = (e) => {
    console.log("BLAH")
    setShow3D(e.target.checked)
  }

  const CanvasFunc = show3D ? Canvas3D : Canvas2D

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
        <label for="canvas-switch">3D Canvas: </label>
        <input id="canvas-switch" checked={show3D} type="checkbox" onChange={setShow3DToggle} />
      </div>
      <CanvasFunc
        {...props}
        f={f}
        stats={stats}
        shaderFunc={shaderFunc}
        numParticles={numParticles}
        highPerformance={highPerformance}
      />
    </>
  )
}
