import React, { useRef, useEffect, useState } from 'react';
import FunctionViewer from './FunctionViewer'

function App(props) {
  const audioRef = useRef(document.querySelector('audio'))
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = useRef(new AudioContext())
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
      <FunctionViewer
        audioCtx={audioCtx.current}
        track={track}
      />
    </div>)
  );
}

export default App;
