// Style
module Style {
  export const Bold: string = '\u001b[1m'
  export const Italic: string = '\u001b[3m'
  export const Underline: string = '\u001b[4m'
  export const Strikethrough: string = '\u001b[9m'

  // Reset
  export enum Reset {
    All = '\u001b[0m',

    Bold = '\u001b[22m',
    Italic = '\u001b[23m',
    Underline = '\u001b[24m',
    Strikethrough = '\u001b[29m'
  }

  // Colors
  export type Colors = 'Default' | 'Red' | 'Yellow' | 'Green' | 'Cyan' | 'Blue' | 'Purple' | 'White' | 'Gray' | 'Black'

  // Text Colors
  export enum TextColors {
    Default = '\u001b[39m',

    Red = '\u001b[31m',
    Yellow = '\u001b[33m',
    Green = '\u001b[32m',
    Cyan = '\u001b[36m',
    Blue = '\u001b[34m',
    Purple = '\u001b[35m',

    White = '\u001b[37m',
    Gray = '\u001b[90m',
    Black = '\u001b[30m'
  }

  // Background Colors
  export enum BackgroundColors {
    Default = '\u001b[39m',

    Red = '\u001b[41m',
    Yellow = '\u001b[43m',
    Green = '\u001b[42m',
    Cyan = '\u001b[46m',
    Blue = '\u001b[44m',
    Purple = '\u001b[45m',

    White = '\u001b[47m',
    Gray = '\u001b[100m',
    Black = '\u001b[40m'
  }
}

export default Style
