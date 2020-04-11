import React from 'react'
import styles from './Tabs.module.css'
import Color from 'color'

function Tabs(props) {
  let rgbColor = props.highlightColor
  delete rgbColor.a
  const highlightColor = Color(rgbColor)
  const isLightBG = highlightColor.isLight()
  
  const tabClicked = (label) => {
    return (e) => {
      /* eslint-disable-next-line */
      props.onChange ? props.onChange(label) : null
    }
  }

  const tabs = props.labels.map((label) => {
    const isLabel = label == props.value
  
    return (
      <div 
        style={{ backgroundColor: isLabel ? highlightColor.rgb().string() : '#555555' }}
        className={[styles.tab, (isLabel ? styles.active : "")].join(' ')}
        onClick={tabClicked(label)}
      >
        <span style={{color: isLabel && isLightBG ? '#333' : '#FFF'}}>
          {label}
        </span>
      </div>
    )
  })
  return (
    <div className={styles.tabs}>
      { tabs }
    </div>
  )
}

export default Tabs
