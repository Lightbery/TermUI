import { Component } from './Component'

// Page
class Page {
  public name!: string

  public components: Component[] = []

  constructor (name: string) {
    this.name = name
  }

  // Handle Keydown
  public keydown (data: Buffer): void {
    for (const component of this.components) component.keydown(data)
  }
}

// Builtin Pages
module Pages {

}

export { Page, Pages }
