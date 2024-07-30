import { TermUIComponent } from './TermUI'

// Components
module Components {
  // Page Tabs
  export class PageTabs extends TermUIComponent {
    constructor () {
      super('pageTabs', 1)
    }

    // Render The Component 
    public render (width: number, height: number): string[] {
      return ['']
    }
  }
}

export default Components
