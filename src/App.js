import React, { useRef, useEffect, useState } from 'react';
import FunctionViewer from './FunctionViewer'

function App(props) {
  const audioRef = useRef(document.querySelector('audio'))
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = useRef(new AudioContext())
  const [ track, setTrack ] = useState(null)

  const handleSuccess = function(stream) {
    setTrack(audioCtx.current.createMediaStreamSource(stream))
  }

  useEffect(() => {
    // console.log("AUDIO ELEMENT", audioRef.current)
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
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
