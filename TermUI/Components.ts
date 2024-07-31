import { TermUI, TermUIComponent } from './TermUI'

// Components
module Components {
  // Blank
  export class Blank extends TermUIComponent {
    constructor (size?: number) {
      super('blank', (size === undefined) ? 1 : size)
    }

    // Render The Component
    public render (): string[] {
      const lines: string[] = []

      for (let i = 0; i < this.size; i++) lines.push('')

      return lines
    }
  }

  // Text
  export class Text extends TermUIComponent {
    private _lines!: string[]

    constructor (content: string) {
      super('blank', content.split('\n').length)

      this._lines = content.split('\n')
    }

    // Render The Component
    public render (): string[] {
      return this._lines
    }
  }

  // Page Tabs
  export class PageTabs extends TermUIComponent {
    constructor () {
      super('pageTabs', 1)
    }

    // Render The Component 
    public render (Core: TermUI, width: number): string[] {
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

      const leftTabsWidth = TermUI.measureString(leftTabs.join(' ')) + 1
      const rightTabsWidth = TermUI.measureString(rightTabs.join(' ')) + 1

      if (leftTabsWidth + rightTabsWidth < width) return [' ' + leftTabs.join(' ') + ' '.repeat(width - (leftTabsWidth + rightTabsWidth)) + rightTabs.join(' ') + ' ']
      else return [' ' + leftTabs.join(' ') + rightTabs.join(' ')]
    }
  }

  // Page Content
  export class PageContent extends TermUIComponent {
    public style: Components.PageContentStyle = {
      selected_prefix: ' ',
      notSelected_prefix: ' '
    }

    constructor() {
      super('pageContent', Infinity)
    }

    // Set The Style Of The Component
    public setStyle (style: Components.PageContentStyle): Components.PageContent {
      this.style = style

      return this
    }

    // Render The Component
    public render (Core: TermUI, width: number, height: number): string[] {
      const lines = []

      if (Core.currentPage === undefined) {
        for (let i = 0; i < height; i++) lines.push('')
      } else {
        const info = Core.getPageInfo(Core.currentPage)
        const content = Core.getPageContent()

        for (let i = info.scroll; i < info.scroll + height; i++) {
          if (i < content.length) {
            if (i === info.scroll) lines.push(`${this.style.selected_prefix.replaceAll('<$line>', i.toString())}${Core.style.backgorundColor}${Core.style.textColor}${content[i]}${Core.style.backgorundColor}${Core.style.textColor}`)
            else lines.push(`${this.style.notSelected_prefix.replaceAll('<$line>', i.toString())}${Core.style.backgorundColor}${Core.style.textColor}${content[i]}${Core.style.backgorundColor}${Core.style.textColor}`)
          } else lines.push('')
        }
      }

      return lines
    }
  }

  // Page Content Style
  export interface PageContentStyle {
    selected_prefix: string,
    notSelected_prefix: string
  }
}

export default Components
