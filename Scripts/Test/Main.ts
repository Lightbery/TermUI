import { TermUI, Page, Components } from '../../TermUI/API'

const UI = new TermUI(process.stdout.columns, process.stdout.rows)
  .addPage('log', new class extends Page {
    constructor () {
      super('Log')

      this.components = [
        new Components.PageTabs(),
        new Components.Blank(),
        new Components.PageContent(() => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
        new Components.Blank()
      ]
    } 
  })

UI.start()

// UI.render()

//process.stdout.write('\n'.repeat(process.stdout.rows))
//
//process.stdout.write(UI.render())
