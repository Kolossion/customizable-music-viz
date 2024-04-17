import React, { useState } from 'react';
import Slider from 'rc-slider'
import { DEFAULT_FUNC, DEFAULT_F, DEFAULT_CHANGE_FUNC } from './shaders'
import { ArrowLeft, ArrowRight } from 'react-feather'
import Canvas3D from './Canvas3D'
import Canvas2D from './Canvas2D'
import Tabs from './components/Tabs'
import Color from 'color'
import 'rc-slider/assets/index.css'
import ColorPicker from './components/ColorPicker';
import pick from 'lodash/pick'

export default function FunctionViewer(props) {
  // const { gl } = useThree() 
  const [shaderFunc, setShaderFunc] = useState(
      localStorage.getItem('shaderFunc') ||
      DEFAULT_FUNC
    )
  const [lastShaderFunc, setLastShaderFunc] = useState("0")
  const [f, setF] = useState(
      localStorage.getItem('f') ||
      DEFAULT_F
    )
  const [lastF, setLastF] = useState("0")
  const [changeFunc, setChangeFunc] = useState(
      localStorage.getItem('changeFunc') ||
      DEFAULT_CHANGE_FUNC)
  const [canvas, setCanvas] = useState(localStorage.getItem('canvas') || "2D")
  const [screenshotSize, setScreenshotSize] = useState(5000)
  const [highPerformance, setHighPerformance] = useState(true)
  const [posColorVal, _setPosColorVal] = useState(
      Color(localStorage.getItem('posColor')).object() ||
      { r: 255, g: 255, b: 255 }
    )
  const [negColorVal, _setNegColorVal] = useState(
      Color(localStorage.getItem('negColor')).object() ||
      { r: 0, g: 0, b: 0 }
    )
  const [numParticles, setNumParticles] = useState(1000)
  const [fftSize, setFftSize] = useState(localStorage.getItem('fftSize') || 8)
  const [smoothingTimeConstant, setSmoothingTimeConstant] = useState(localStorage.getItem('smoothing') || 0.5)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(0)

  const setCanvasState = (state) => {
    localStorage.setItem('canvas', state)
    setCanvas(state)
  }

  const setPosColorVal = (rgbColor) => {
    const color = pick(rgbColor, ['r', 'g', 'b'])
    localStorage.setItem('posColor', Color(color).rgb().string())
    _setPosColorVal(rgbColor)
  }

  const setNegColorVal = (rgbColor) => {
    const color = pick(rgbColor, ['r', 'g', 'b'])
    localStorage.setItem('negColor', Color(color).rgb().string())
    _setNegColorVal(rgbColor)
  }

  const setFText = () => {
    const text = document.getElementById('f-input').value
    localStorage.setItem('f', text)
    setLastF(f)
    setF(text)
  }

  const setFTextOnEnter = (e) => {
    if (e.keyCode == 13) {
      setFText()
    }
  }

  const setShaderFuncText = () => {
    const text = document.getElementById('fn-input').value
    localStorage.setItem('shaderFunc', text)
    setLastShaderFunc(shaderFunc)
    setShaderFunc(text)
  }

  const setShaderFuncTextOnEnter = (e) => {
    if (e.keyCode == 13) {
      setShaderFuncText()
    }
  }

  const setChangeFuncText = () => {
    const text = document.getElementById('change-input').value
    localStorage.setItem('changeFunc', text)
    setChangeFunc(text)
  }

  const setChangeFuncTextOnEnter = (e) => {
    if (e.keyCode == 13) {
      setChangeFuncText()
    }
  }

  const changeParticleCount = (val) => {
    console.log("SOME MATH", Math.pow(10_000_000, val))
    setNumParticles(Math.round(Math.pow(10_000_000, val)))
  }

  const changeFftSize = (val) => {
    localStorage.setItem('fftSize', val)
    setFftSize(val)
  }

  const changeSmoothingTimeConstant = (val) => {
    localStorage.setItem('smoothing', val)
    setSmoothingTimeConstant(val)
  }

  const CanvasFunc = canvas === "3D" ? Canvas3D : Canvas2D

  const genRandomColors = (e) => {
    const randomPosColor = { 
      r: Math.random() * 256,
      g: Math.random() * 256,
      b: Math.random() * 256
    }
    const randomNegColor = { 
      r: Math.random() * 256,
      g: Math.random() * 256,
      b: Math.random() * 256
    }

    _setPosColorVal(randomPosColor)
    _setNegColorVal(randomNegColor)
  }

  return (
    <>
      <div className={"sidebar " + (!sidebarOpen ? "hidden" : "")}>
        <h2>Customize Visualizer</h2>
        <Tabs highlightColor={posColorVal} onChange={setCanvasState} labels={['3D', '2D']} value={canvas} />
        <div className="removable drawer-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
          { sidebarOpen ?
            <ArrowRight color="#ffffff"/> :
            <ArrowLeft color="#ffffff"/>
          }
        </div>
        <label htmlFor="f-input">Value of <i>f</i></label>
        <input id="f-input" name="f-input" type="text" onKeyUp={setFTextOnEnter} defaultValue={f} />
        <label htmlFor="fn-input">Shader function</label>
        <input id="fn-input" name="fn-input" type="text" onKeyUp={setShaderFuncTextOnEnter} defaultValue={shaderFunc} />
        <label htmlFor="change-input">Change function</label>
        <input id="change-input" name="change-input" type="text" onKeyUp={setChangeFuncTextOnEnter} defaultValue={changeFunc} />
        <label htmlFor="fft-size">FFT bins: 2**{fftSize}</label>
        <div style={{ width: '100%', padding: '10px'}}>
          <Slider id="fft-size" name="fft-size" onChange={changeFftSize} min={5} max={14} step={1} value={fftSize}/>
        </div>
        <label htmlFor="smoothing-constant">Smoothing Time Constant: {smoothingTimeConstant}</label>
        <div style={{ width: '100%', padding: '10px'}}>
          <Slider id="smoothing-constant" name="smoothing-constant" onChange={changeSmoothingTimeConstant} min={0.} max={1} step={1/1000} value={smoothingTimeConstant}/>
        </div>
        { canvas === "3D" ? 
          <>
            <label htmlFor="num-particles">Number of Particles: {numParticles}</label>
            <div style={{ width: '100%', padding: '10px'}}>
              <Slider id="num-particles" name="num-particles" onChange={changeParticleCount} min={0.5} max={1} step={1/1000}/>
            </div>
            <label htmlFor="auto-rotate">Auto Rotate Speed</label>
            <div style={{ width: '100%', padding: '10px'}}>
              <Slider id="auto-rotate" name="auto-rotate" onChange={setAutoRotateSpeed} min={0} max={4} step={1/1000} value={autoRotateSpeed} />
            </div>
          </> :
          <>
            <label htmlFor="screenshot-size">Screenshot Size</label>
            <input id="screenshot-size" type="number" value={screenshotSize} onChange={(e) => setScreenshotSize(e.target.value)} />
            <button onClick={genRandomColors}>Random Colors!</button>
            <ColorPicker
              value={posColorVal}
              onChange={(e) => setPosColorVal(e.rgb)}
              label="Positive Color"
            />
            <ColorPicker
              value={negColorVal}
              onChange={(e) => setNegColorVal(e.rgb)}
              label="Negative Color"
            />
            <p>Press <b>Shift + R</b> to capture the canvas as an image.</p>
          </>
        }
        {/* <label htmlFor="canvas-switch">3D Canvas: </label>
        <input id="canvas-switch" checked={show3D} type="checkbox" onChange={setShow3DToggle} /> */}
      </div>
      <CanvasFunc
        {...props}
        colors={{
          posColor: posColorVal,
          negColor: negColorVal
        }}
        screenshotSize={screenshotSize}
        f={f}
        lastF={lastF}
        shaderFunc={shaderFunc}
        lastShaderFunc={lastShaderFunc}
        changeFunc={changeFunc}
        numParticles={numParticles}
        fftSize={2**fftSize}
        smoothingTimeConstant={smoothingTimeConstant}
        highPerformance={highPerformance}
        autoRotateSpeed={autoRotateSpeed}
      />
    </>
  )
}