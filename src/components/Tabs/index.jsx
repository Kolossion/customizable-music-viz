import React from 'react'
import styles from './Tabs.module.css'

function Tabs(props) {
  const tabClicked = (label) => {
    return (e) => {
      /* eslint-disable-next-line */
      props.onChange ? props.onChange(label) : null
    }
  }


  const tabs = props.labels.map((label) => {
   return (
    <div 
      className={[styles.tab, (label == props.value ? styles.active : "")].join(' ')}
      onClick={tabClicked(label)}
    >
      {label}
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
