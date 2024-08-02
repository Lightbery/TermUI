import measureText from './MeasureText'

// Reduce A Text
export default (string: string, width: number): string => {
  const stringWidth = measureText(string)

  if (stringWidth > width) {
    let end = string.length - (width - stringWidth)

    while (measureText(string.substring(0, end + 1)) < width) end++

    return string.substring(0, end)
  }

  return string
}
