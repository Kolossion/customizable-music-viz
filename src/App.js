import React, { useRef, useEffect, useState } from 'react';
import Cloud from './Cloud'
import ViewControls from './ViewControls'
import {vertex_shader, fragment_shader} from './shaders'
import { Canvas } from 'react-three-fiber'

function App(props) {
  const audioRef = useRef(document.querySelector('audio'))
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = useRef(new AudioContext())
  // const trackRef = useRef(null)
  const [ track, setTrack ] = useState(null)

  useEffect(() => {
    // console.log("AUDIO ELEMENT", audioRef.current)
    const temp_track = audioCtx.current.createMediaElementSource(audioRef.current)
    temp_track.connect(audioCtx.current.destination)
    setTrack(temp_track)
  }, [])

  return (
    !track ? null :
    (<div className="App">
      {/* <audio ref={audioRef} src="http://199.180.75.58:9448/stream" crossOrigin="anonymous"></audio> */}
      <Canvas 
        style={{ height: 'calc(100vh - 60px)' }}
        camera={{position:[0, 0, 2]}} 
        gl={{ alpha: false, antialias: false, }}
      >
        <Cloud 
          audioCtx={audioCtx.current}
          track={track}
          particleCount={10000}
          fft={Math.pow(2, 14)}
          v_shader={vertex_shader()}
          f_shader={fragment_shader}
        />
        <ViewControls />
      </Canvas>
    </div>)
  );
}

export default App;
