import Components from '../../TermUI/Components'
import { TermUI } from '../../TermUI/TermUI'

const UI = new TermUI(process.stdout.columns, process.stdout.rows)
  .setLayout([
    new Components.PageTabs(),
    new Components.PageTabs(),
    new Components.PageTabs(),
  ])
  .addPage('log', {
    name: 'log',

    render: () => ['1', '2', '3', '4', '5', '6']
  })
  .addPage('log2', {
    name: 'log',
    align: 'right',

    render: () => ['1', '2', '3', '4', '5', '6']
  })
  .addPage('log3', {
    name: 'log',
    align: 'left',

    render: () => ['1', '2', '3', '4', '5', '6']
  })

process.stdout.write('\n'.repeat(process.stdout.rows))

process.stdout.write(UI.render())
