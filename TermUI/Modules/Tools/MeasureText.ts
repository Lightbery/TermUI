import wcwidth from 'wcwidth'

// Measure A Text
export default (string: string): number => {
  let pureText: string = ''
 
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '\x1b') {
      const oldIndex = i
 
      while (string[i] !== 'm' && i < string.length) i++
 
      if (string[i] !== 'm') i = oldIndex + 1
    } else pureText += string[i]
  }
 
  return wcwidth(pureText)
} 
