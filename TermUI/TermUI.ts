import wcwidth from 'wcwidth'

// TermUI
class TermUI {
  // Measure String
  public static measureString (string: string): number {
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

  // Reduce A String
  public static reduceString (string: string, width: number) {
    const stringWidth = this.measureString(string)

    if (stringWidth > width) {
      let end = string.length - (width - stringWidth)

      while (this.measureString(string.substring(0, end + 1)) < width) end++

      return string.substring(0, end)
    }

    return string
  }

  public width!: number
  public height!: number

  public layout: TermUIComponent[] = []
  public style: TermUIStyle = {
    backgorundColor: Style.Reset.All,
    textColor: Style.Reset.All,

    selected_BackgroundColor: Style.BackgroundColors.White,
    selected_TextColor: Style.TextColors.Black,
    notSelected_BackgroundColor: Style.BackgroundColors.Gray,
    notSelected_TextColor: Style.TextColors.White
  }

  private _pages: { [key: string]: TermUIPageData } = {}
  private _currentPage: undefined | string = undefined

  private _oldLines: string[] = []
    
  constructor (width: number, height: number) {
    this.width = width
    this.height = height
  }

  public get currentPage () {return this._currentPage}

    // Get All The Pages
  public getAllPages (): string[] {
    return Object.keys(this._pages)
  }

  // Get The Info Of A Page
  public getPageInfo (id: string): { name: string, align: 'left' | 'right', cursor: number, scroll: number } {
    if (this._pages[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    const page = this._pages[id]

    return {
      name: page.name,
      align: page.align,

      cursor: page.cursor,
      scroll: page.scroll
    }
  }

  // Get Content Of The Current Page 
  public getPageContent (): string[] {
    if (this.currentPage === undefined) throw new Error('No Current Page')

    return this._pages[this._currentPage!].content
  }

  // Set The Size Of The Interface
  public setSize (width: undefined | number, height: undefined | number): TermUI {
    if (width !== undefined) this.width = width
    if (height !== undefined) this.height = height

    return this
  }

  // Set The Layout Of The Interface
  public setLayout (layout: TermUIComponent[]): TermUI {
    this.layout = layout

    return this
  }

  // Set The Style Of The Interface
  public setStyle (style: TermUIStyle): TermUI {
    this.style = style

    return this
  }

  // Add A Page
  public addPage (id: string, page: TermUIPage): TermUI {
    if (this._pages[id] !== undefined) throw new Error(`Page Already Exists: "${id}"`)

    this._pages[id] = {
      name: page.name,
      align: (page.align === undefined) ? 'left' : page.align,

      render: page.render,
      content: page.render(),

      cursor: 0,
      scroll: 0
    }

    if (this._currentPage === undefined) this._currentPage = id

    return this
  }

  // Remove A Page
  public removePage (id: string): void {
    if (this._pages[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    delete this._pages[id]

    if (this._currentPage === id) {
      const pages = Object.keys(this._pages)

      this._currentPage = (pages.length > 0) ? pages[0] : undefined
    }
  }

  // Switch A Page
  public switchPage (id: string): void {
    if (this._pages[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    this._currentPage = id
  }

  // Render The Interface
  public render (): string {
    if (this._currentPage !== undefined) {
      const page = this._pages[this._currentPage]

      page.content = page.render() 
    }

    return this.renderRaw().map((change) => `\x1B[H${(change.line > 0) ? `\x1B[${change.line}B` : ''}\x1B[2K${change.content}`).join('')
  }

  // Render The Interface (Raw Changes)
  public renderRaw (): { line: number, content: string }[] {
    // Get the size of the components.

    let leftSpace: number = this.height
    let fullComponents: number = 0

    for (const component of this.layout) {
      if (component.size === Infinity) fullComponents++
      else leftSpace -= component.size
    }

    // Render the components.

    let lines: string[] = []

    for (const component of this.layout) {
      const size = (component.size === Infinity) ? Math.floor(leftSpace / fullComponents) : component.size

      const componentLines = component.render(this, this.width, size)

      if (componentLines.length !== size) throw new Error(`Component Render Output Size Does Not Match The Size: "${component.name}"`)

      for (const line of componentLines) lines.push(TermUI.reduceString(line, this.width))
    }
    
    // Get the changes.

    const changes: { line: number, content: string }[] = []

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] != this._oldLines[i]) changes.push({ line: i, content: lines[i] })
    }

    this._oldLines = lines

    return changes
  }
}

// TermUI Component
abstract class TermUIComponent {
  private _name!: string
  private _size!: number

  constructor (name: string, size: number) {
    this._name = name
    this._size = size
  }

  public get name () {return this._name}
  public get size () {return this._size}

  // Render The Component
  public abstract render (Core: TermUI, width: number, height: number): string[]
}


// TermUI Style
interface TermUIStyle {
  backgorundColor: Style.BackgroundColors | Style.Reset,
  textColor: Style.TextColors  | Style.Reset,

  selected_BackgroundColor: Style.BackgroundColors | Style.Reset,
  selected_TextColor: Style.TextColors | Style.Reset,
  notSelected_BackgroundColor: Style.BackgroundColors | Style.Reset,
  notSelected_TextColor: Style.TextColors | Style.Reset,
}

// TermUI Page
interface TermUIPage {
  name: string,
  align?: 'left' | 'right',

  render: () => string[]
}

// TermUIPageData
interface TermUIPageData {
  name: string,
  align: 'left' | 'right',

  render: () => string[],
  content: string[],

  cursor: 0,
  scroll: 0
}

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

// Keyboard
module Keyboard {
  // keys
  export enum Keys {
    a = '61',
    b = '62',
    c = '63',
    d = '64',
    e = '65',
    f = '66',
    g = '67',
    h = '68',
    i = '69',
    j = '6a',
    k = '6b',
    l = '6c',
    m = '6d',
    n = '6e',
    o = '6f',
    p = '70',
    q = '71',
    r = '72',
    s = '73',
    t = '74',
    u = '75',
    v = '76',
    w = '77',
    x = '78',
    y = '79',
    z = '7a',

    A = '41',
    B = '42',
    C = '43',
    D = '44',
    E = '45',
    F = '46',
    G = '47',
    H = '48',
    I = '49',
    J = '4a',
    K = '4b',
    L = '4c',
    M = '4d',
    N = '4e',
    O = '4f',
    P = '50',
    Q = '51',
    R = '52',
    S = '53',
    T = '54',
    U = '55',
    V = '56',
    W = '57',
    X = '58',
    Y = '59',
    Z = '5a',

    CtrlA = '01',
    CtrlB = '02',
    CtrlC = '03',
    CtrlD = '04',
    CtrlE = '05',
    CtrlF = '06',
    CtrlG = '07',
    CtrlH = '08',
    CtrlJ = '0a',
    CtrlK = '0b',
    CtrlL = '0c',
    CtrlN = '0e',
    CtrlO = '0f',
    CtrlP = '10',
    CtrlQ = '11',
    CtrlR = '12',
    CtrlS = '13',
    CtrlT = '14',
    CtrlU = '15',
    CtrlV = '16',
    CtrlW = '17',
    CtrlX = '18',
    CtrlY = '19',

    Backtick = '60',
    Tilde = '7e',
    Zero = '30',
    CloseParenthesis = '29',
    One = '31',
    ExclamationMark = '21',
    Two = '32',
    AtSign = '40',
    Three = '33',
    Hash = '23',
    Four = '34',
    DollarSign = '24',
    Five = '35',
    PercentSign = '25',
    Six = '36',
    Caret = '5e',
    Seven = '37',
    Ampersand = '26',
    Eight = '38',
    Asterisk = '2a',
    Nine = '39',
    OpenParenthesis = '28',
    Hyphen = '2d',
    Underscore = '5f',
    EqualsSign = '3d',
    PlusSign = '2b',

    OpenBracket = '5b',
    CloseBracket = '5d',
    OpenBraces = '7b',
    CloseBraces = '7d',
    Backslash = '5c',
    VerticalBar = '7c',
    SemiColon = '3b',
    Colon = '3a',
    ApostropheMark = '27',
    QuotationMark = '22',
    Comma = '2c',
    LessThan = '3c',
    Period = '2e',
    MoreThan = '3e',
    Slash = '2f',
    QuestionMark = '3f',

    Space = '20',
    Enter = '0d',
    Delete = '7f',
    Tab = '09',
    Esc = '1b',
    ArrowLeft = '1b5b44',
    ArrowRight = '1b5b43',
    ArrowUp = '1b5b41',
    ArrowDown = '1b5b42',

    F1 = '1b4f50',
    F2 = '1b4f51',
    F3 = '1b4f52',
    F4 = '1b4f53',
    F5 = '1b5b31357e',
    F6 = '1b5b31377e',
    F7 = '1b5b31387e',
    F8 = '1b5b31397e',
    F9 = '1b5b32307e',
    F10 = '1b5b32317e',
    F11 = '1b5b32337e',
    F12 = '1b5b32347e',

    NumpadHome = '1b5b48',
    NumpadDelete = '1b5b337e',
    NumpadEnd = '1b5b46',

    PageUp = '1b5b357e',
    PageDown = '1b5b367e',

    None = ''
  }

  // Alphabets
  export const Alphabets = [
    Keyboard.Keys.a, Keyboard.Keys.b, Keyboard.Keys.c, Keyboard.Keys.d, Keyboard.Keys.e, Keyboard.Keys.f, Keyboard.Keys.g, Keyboard.Keys.h, Keyboard.Keys.i, Keyboard.Keys.j, Keyboard.Keys.k, Keyboard.Keys.l, Keyboard.Keys.m, Keyboard.Keys.n, Keyboard.Keys.o, Keyboard.Keys.p, Keyboard.Keys.q, Keyboard.Keys.r, Keyboard.Keys.s, Keyboard.Keys.t, Keyboard.Keys.u, Keyboard.Keys.v, Keyboard.Keys.w, Keyboard.Keys.x, Keyboard.Keys.y, Keyboard.Keys.z,
    Keyboard.Keys.A, Keyboard.Keys.B, Keyboard.Keys.C, Keyboard.Keys.D, Keyboard.Keys.E, Keyboard.Keys.F, Keyboard.Keys.G, Keyboard.Keys.H, Keyboard.Keys.I, Keyboard.Keys.J, Keyboard.Keys.K, Keyboard.Keys.L, Keyboard.Keys.M, Keyboard.Keys.N, Keyboard.Keys.O, Keyboard.Keys.P, Keyboard.Keys.Q, Keyboard.Keys.R, Keyboard.Keys.S, Keyboard.Keys.T, Keyboard.Keys.U, Keyboard.Keys.V, Keyboard.Keys.W, Keyboard.Keys.X, Keyboard.Keys.Y, Keyboard.Keys.Z
  ]

  // Numbers
  export const Numbers = [
    Keyboard.Keys.Zero, Keyboard.Keys.One, Keyboard.Keys.Two, Keyboard.Keys.Three, Keyboard.Keys.Four, Keyboard.Keys.Five, Keyboard.Keys.Six, Keyboard.Keys.Seven, Keyboard.Keys.Eight, Keyboard.Keys.Nine
  ]

  // Symbols
  export const Symbols = [
    Keyboard.Keys.Backtick, Keyboard.Keys.Tilde, Keyboard.Keys.CloseParenthesis, Keyboard.Keys.ExclamationMark, Keyboard.Keys.AtSign, Keyboard.Keys.Hash, Keyboard.Keys.DollarSign, Keyboard.Keys.PercentSign, Keyboard.Keys.Caret, Keyboard.Keys.Ampersand, Keyboard.Keys.Asterisk, Keyboard.Keys.OpenParenthesis, Keyboard.Keys.Hyphen, Keyboard.Keys.Underscore, Keyboard.Keys.EqualsSign, Keyboard.Keys.PlusSign,
    Keyboard.Keys.OpenBracket, Keyboard.Keys.CloseBracket, Keyboard.Keys.OpenBraces, Keyboard.Keys.CloseBraces, Keyboard.Keys.Backslash, Keyboard.Keys.VerticalBar, Keyboard.Keys.SemiColon, Keyboard.Keys.Colon, Keyboard.Keys.ApostropheMark, Keyboard.Keys.QuotationMark, Keyboard.Keys.Comma, Keyboard.Keys.LessThan, Keyboard.Keys.Period, Keyboard.Keys.MoreThan, Keyboard.Keys.Slash, Keyboard.Keys.QuestionMark,
  ]
}

export { TermUI, TermUIComponent, TermUIStyle, TermUIPage, Style, Keyboard }
