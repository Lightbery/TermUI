import measureText from './Tools/MeasureText'
import reduceText from './Tools/ReduceText'
import Keyboard from './Tools/Keyboard'
import Style from './Tools/Style'

import { Page } from './Page'

// TermUI
class TermUI {
  private _state: 'idle' | 'running' = 'idle'

  public width!: number
  public height!: number

  public style: TermUIStyle = {
    backgorundColor: Style.Reset.All,
    textColor: Style.Reset.All,

    selected_BackgroundColor: Style.BackgroundColors.White,
    selected_TextColor: Style.TextColors.Black,
    notSelected_BackgroundColor: Style.BackgroundColors.Gray,
    notSelected_TextColor: Style.TextColors.White
  }

  private _pages_info: { [key: string]: { align: 'left' | 'right', page: Page }} = {}
  private _currentPage: undefined | string = undefined

  private _oldLines: string[] = []

  private _interval: undefined | ReturnType<typeof setInterval> = undefined
  private _onKeydown: (data: Buffer) => void = (data) => this.keydown(data)

  constructor (width: number, height: number) {
    this.width = width
    this.height = height
  }

  public get state () {return this._state}
  public get currentPage () {return this._currentPage}

  // Start The Interface
  public start (): void {
    if (this._state !== 'idle') throw new Error(`Cannot Start The Interface: ${this._state}`)

    this._state = 'running'

    process.stdout.write('\n'.repeat(this.height))
    process.stdin.setRawMode(true)

    this._interval = setInterval(() => process.stdout.write(this.render().map((change) => `\x1B[H${(change.line > 0) ? `\x1B[${change.line}B` : ''}\x1B[2K${change.content}`).join('')), 25)

    process.stdin.on('data', this._onKeydown)
  }

  // Stop The Interface
  public stop (): void {
    if (this._state !== 'running') throw new Error(`Cannot Stop The Interface: ${this._state}`)

    this._state = 'idle'

    clearInterval(this._interval)

    process.stdin.setRawMode(false)
    process.stdin.off('data', this._onKeydown)

    this._interval = undefined 
  }

  // Get IDs Of All The Pages
  public getAllPages (): string[] {
    return Object.keys(this._pages_info)
  }

  // Get The Info Of A Page
  public getPageInfo (id: string) {
    if (this._pages_info[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    const page = this._pages_info[id]

    return {
      name: page.page.name,
      align: page.align
    }
  }

  // Add A Page
  public addPage (id: string, page: Page, align?: 'left' | 'right'): TermUI {
    if (this._pages_info[id] !== undefined) throw new Error(`Page Already Exists: "${id}"`)

    this._pages_info[id] = {
      align: (align === undefined) ? 'left' : align,
      page
    }

    if (this._currentPage === undefined) this._currentPage = id

    return this
  }

  // Remove A Page
  public removePage (id: string): void {
    if (this._pages_info[id] === undefined) throw new Error(`Page Not Found: "${id}"`)

    delete this._pages_info[id]

    if (id === this._currentPage) {
      const pages = Object.keys(this._pages_info)

      this._currentPage = (pages.length > 0) ? pages[0] : undefined
    }
  }

  // Remove All The Pages
  public removeAllPages (): void {
    this._pages_info = {}
    this._currentPage = undefined
  }

  // Render The interface
  public render (): { line: number, content: string }[] {
    let lines: string[] = []

    if (this.currentPage !== undefined) {
      let leftSpace: number = this.height
      let fullComponents: number = 0

      for (const component of this._pages_info[this._currentPage!].page.components) {
        if (component.size === Infinity) fullComponents++
        else leftSpace -= component.size
      }

      for (const component of this._pages_info[this._currentPage!].page.components) {
        const size = (component.size === Infinity) ? Math.floor(leftSpace / fullComponents) : component.size

        const componentLines = component.render(this, size)

        if (componentLines.length !== size) throw new Error(`Component Render Output Size Does Not Match The Size: "${component.name}"`)

        for (let line of componentLines) {
          line = (this.style.backgorundColor + this.style.textColor) + reduceText(line, this.width)

          const width = measureText(line)

          if (width < this.width) line += ' '.repeat(this.width - width)

          lines.push(line)
        }
      }

      lines = lines.slice(0, this.height)
    }

    for (let i = lines.length; i < this.height; i++) lines.push(`${this.style.backgorundColor}${' '.repeat(this.width)}`)

    const changes: { line: number, content: string }[] = []

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== this._oldLines[i]) changes.push({ line: i, content: lines[i] })
    }

    this._oldLines = lines

    return changes
  }

  // Handle keydown
  public keydown (data: Buffer): void {
    const hex = data.toString('hex')

    if (this._state === 'running' && hex === Keyboard.Keys.CtrlC) process.exit()

    if (this._currentPage !== undefined) {
      if (hex === Keyboard.Keys.ArrowLeft || hex === Keyboard.Keys.ArrowRight) {
        const pages = Object.keys(this._pages_info)

        let index = pages.indexOf(this._currentPage)

        if (hex === Keyboard.Keys.ArrowLeft) {
          index--

          if (index < 0) index = pages.length - 1
        } else {
          index++

          if (index >= pages.length) index = 0
        }

        this._currentPage = pages[index]
      }

      this._pages_info[this._currentPage].page.keydown(data)
    }
  }
}

// TermUI Style
interface TermUIStyle {
  backgorundColor: Style.BackgroundColors | Style.Reset,
  textColor: Style.TextColors  | Style.Reset,

  selected_BackgroundColor: Style.BackgroundColors | Style.Reset,
  selected_TextColor: Style.TextColors | Style.Reset,
  notSelected_BackgroundColor: Style.BackgroundColors | Style.Reset,
  notSelected_TextColor: Style.TextColors | Style.Reset
}

export { TermUI, TermUIStyle }
