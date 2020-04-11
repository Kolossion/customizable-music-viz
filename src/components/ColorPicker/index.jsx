import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import ClickOutside from 'react-click-outside'
import styles from './ColorPicker.module.css'
import { rgbToCSS } from '../../lib/helpers'
import Color from 'color'

function ColorPicker(props) {
  const { value, onChange } = props
  const [isOpen, setIsOpen] = useState(false)
  let tempVal = props.value
  delete tempVal.a
  const pickerColor = Color(tempVal)

  return (
    <div className={styles.colorPicker}>
      <div onClick={() => setIsOpen(!isOpen)} className={styles.colorPickerButton}>
        <p>{ props.label }</p>
        <div style={{ backgroundColor: pickerColor.rgb().string() }}className={styles.colorSwatch} />
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
