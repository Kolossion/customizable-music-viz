export const rgbToCSS = (rgbColor) => {
  const { r, g, b, a } = rgbColor
  return `rgba(${r}, ${g}, ${b}, ${a})`
}