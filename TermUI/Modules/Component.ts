import measureText from './Tools/MeasureText'
import Keyboard from './Tools/Keyboard'

import { TermUI } from './Main'

// Component
abstract class Component {
  private _name!: string
  private _size!: number

  constructor (name: string, size: number) {
    this._name = name
    this._size = size
  }

  public get name () {return this._name}
  public get size () {return this._size}

  // Render The Component
  public abstract render (Core: TermUI, size: number): string[]

  // Handle Keydown
  public abstract keydown (data: Buffer): void
}

// Builtin Components
module Components {
  // Blank
  export class Blank extends Component {
    constructor (size?: number) {
      super('blank', (size === undefined) ? 1 : size)
    }

    // Render The Component
    public render (_: TermUI, size: number): string[] {
      const lines: string[] = []

      for (let i = 0; i < size; i++) lines.push('')

      return lines
    }

    // Handle Keydown
    public keydown () {}
  }

  // Text
  export class Text extends Component {
    private _content!: string

    constructor (content: string) {
      super('text', content.split('\n').length)

      this._content = content
    }

    // Render The Component
    public render (): string[] {
      return this._content.split('\n')
    }

    // Handle Keydown
    public keydown () {}
  }

  // Page Tabs
  export class PageTabs extends Component {
    public style: Components.PageTabsStyle = {
      padding: 1
    }

    constructor () {
      super('pageTabs', 1)
    }

    // Set The Style Of The Component
    public setStyle (style: Components.PageTabsStyle): Components.PageTabs {
      this.style = style

      return this
    }
    
    // Render The Component
    public render (Core: TermUI) {
      const leftTabs: string[] = []
      const rightTabs: string[] = []

      for (const id of Core.getAllPages()) {
        const pageInfo = Core.getPageInfo(id)

        const string = (id === Core.currentPage)
          ? `${Core.style.selected_BackgroundColor}${Core.style.selected_TextColor} ${pageInfo.name} ${Core.style.backgorundColor}${Core.style.textColor}`
          : `${Core.style.notSelected_BackgroundColor}${Core.style.notSelected_TextColor} ${pageInfo.name} ${Core.style.backgorundColor}${Core.style.textColor}`

        if (pageInfo.align === 'left') leftTabs.push(string)
        else rightTabs.push(string)
      }

      const leftTabsWidth = measureText(leftTabs.join(' '.repeat(this.style.padding))) + this.style.padding
      const rightTabsWidth = measureText(rightTabs.join(' '.repeat(this.style.padding))) + this.style.padding

      if (leftTabsWidth + rightTabsWidth < Core.width) return [' ' + leftTabs.join(' ') + ' '.repeat(Core.width - (leftTabsWidth + rightTabsWidth)) + rightTabs.join(' ') + ' ']
      else return [' '.repeat(this.style.padding) + leftTabs.join(' ') + rightTabs.join(' ')]
    }

    // Handle Keydown
    public keydown () {}
  }

  // Page Tabs Style
  export interface PageTabsStyle {
    padding: number 
  }

  // Page Content
  export class PageContent extends Component {
    private _render!: () => string[]
    private _content!: string[]

    public cursor: number = 0
    public scroll: number = 0

    public style: Components.PageContentStyle = {
      selected_prefix: '> ',
      notSelected_prefix: '  '
    }

    constructor(render: () => string[]) {
      super('pageContent', Infinity)

      this._render = render
      this._content = render()
    }

    // Set The Style Of The Component
    public setStyle (style: Components.PageContentStyle): Components.PageContent {
      this.style = style

      return this
    }

    // Render The Component
    public render (Core: TermUI, size: number): string[] {
      const lines = []

      if (Core.currentPage === undefined) {
        for (let i = 0; i < size; i++) lines.push('')
      } else {
        this._content = this._render()

        if (this.cursor > size) this.scroll = (this.cursor - size) + 1
        else if (this.cursor < this.scroll) this.scroll = this.cursor

        for (let i = this.scroll; i < this.scroll + size; i++) {
          if (i < this._content.length) {
            if (i === this.cursor) lines.push(`${this.style.selected_prefix.replaceAll('<$line>', i.toString())}${Core.style.backgorundColor}${Core.style.textColor}${this._content[i]}${Core.style.backgorundColor}${Core.style.textColor}`)
            else lines.push(`${this.style.notSelected_prefix.replaceAll('<$line>', i.toString())}${Core.style.backgorundColor}${Core.style.textColor}${this._content[i]}${Core.style.backgorundColor}${Core.style.textColor}`)
          } else lines.push('')
        }
      }

      return lines
    }

    // Handle Keydown
    public keydown (data: Buffer) {
      const hex = data.toString('hex')

      if (hex === Keyboard.Keys.ArrowUp && this.cursor > 0) this.cursor--
      else if (hex === Keyboard.Keys.ArrowDown && this.cursor < this._content.length - 1) this.cursor++
    }
  }

  // Page Content Style
  export interface PageContentStyle {
    selected_prefix: string,
    notSelected_prefix: string
  }
}

export { Component, Components }
