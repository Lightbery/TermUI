import Components from '../../TermUI/Components'
import { TermUI } from '../../TermUI/TermUI'

const UI = new TermUI(process.stdout.columns, process.stdout.rows - 1)
  .setLayout([
    new Components.PageTabs(),
    new Components.Blank(),
    new Components.PageContent(),
    new Components.Blank()
  ])
  .addPage('log', {
    name: 'log',

    render: () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
  })
  .addPage('log2', {
    name: 'log',
    align: 'right',

    render: () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
  })
  .addPage('log3', {
    name: 'log',
    align: 'left',

    render: () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
  })
  .addPage('log4', {
    name: 'log',
    align: 'left',

    render: () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
  })
  .addPage('log5', {
    name: 'log',
    align: 'left',

    render: () => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
  })

process.stdout.write('\n'.repeat(process.stdout.rows))

process.stdout.write(UI.render())
