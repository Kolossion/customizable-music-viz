import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import ClickOutside from 'react-click-outside'
import styles from './ColorPicker.module.css'
import Color from 'color'
import { RefreshCw } from 'react-feather'

function ColorPicker(props) {
  const { value, onChange } = props
  const [isOpen, setIsOpen] = useState(false)
  let tempVal = props.value
  delete tempVal.a
  const pickerColor = Color(tempVal)

  const genRandomColor = (e) => {
    e.stopPropagation()
    const randomColor = { 
      r: Math.random() * 256,
      g: Math.random() * 256,
      b: Math.random() * 256
    }

    onChange({rgb: randomColor})
  }

  return (
    <div className={styles.colorPicker}>
      <div onClick={() => setIsOpen(!isOpen)} className={styles.colorPickerButton}>
        <p>{ props.label }</p>
        <div className={styles.iconPanel}>
          <div style={{ backgroundColor: pickerColor.rgb().string() }} className={styles.colorSwatch} />
          <div className={styles.random} onClick={genRandomColor}>
            <RefreshCw width="18" height="18" />
          </div>
        </div>
      </div>
      <ClickOutside onClickOutside={() => setIsOpen(false)}>
        <div style={{display: isOpen ? 'block' : 'none'}} className={styles.pickerContainer}>
          <SketchPicker color={value} onChange={onChange}/>
        </div>
      </ClickOutside>
    </div>
  )
}

export default ColorPicker
