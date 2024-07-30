import { TermUI, TermUIComponent, Style } from './TermUI'

// Components
module Components {
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
          : `${Core.style.unselected_BackgroundColor}${Core.style.unselected_TextColor} ${pageInfo.name} ${Core.style.backgorundColor}${Core.style.textColor}`

        if (pageInfo.align === 'left') leftTabs.push(string)
        else rightTabs.push(string)
      }

      const leftTabsWidth = TermUI.measureString(leftTabs.join(' '))
      const rightTabsWidth = TermUI.measureString(rightTabs.join(' '))

      if (leftTabsWidth + rightTabsWidth < width) return [leftTabs.join(' ') + ' '.repeat(width - (leftTabsWidth + rightTabsWidth)) + rightTabs.join(' ')]
      else return [leftTabs.join(' ') + rightTabs.join(' ')]
    }
  }
}

export default Components
