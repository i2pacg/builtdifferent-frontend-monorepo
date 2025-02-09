import { Extension } from '@tiptap/core'

export interface IndentOptions {
  types: string[]
  min: number
  max: number
}
const TAB_CHAR = '\u0009'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    indent: {
      outdent: (bc?: boolean) => ReturnType
      indent: () => ReturnType
      unsetIndent: () => ReturnType
    }
  }
}
export const IndentExtension = Extension.create<IndentOptions>({
  name: 'indent',
  addOptions() {
    return {
      types: ['listItem', 'heading', 'paragraph', 'blockquote'],
      min: 0,
      max: Number.POSITIVE_INFINITY,
    }
  },
  addCommands() {
    return {
      outdent:
        backspace =>
          ({ chain, state }) => {
            const selection = state.selection
            if (backspace && (selection.$anchor.parentOffset > 0 || selection.from !== selection.to))
              return false
            return chain()
              .setMarginLeft(update({ step: -1, unit: 'rem', min: this.options.min, max: this.options.max }))
              .run()
          },
      indent:
        () =>
          ({ chain }) =>
            chain()
              .setMarginLeft(update({ unit: 'rem', min: this.options.min, max: this.options.max }))
              .run(),
      unsetIndent:
        () =>
          ({ commands }) => {
            return commands.unsetMarginLeft()
          },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Tab': ({ editor }) => {
        const { selection } = editor.state
        const { $from } = selection

        // Check if we're at the start of a list item
        console.log('editor.isActive list item', editor.isActive('listItem'))
        console.log($from.parentOffset)
        if (editor.isActive('listItem') && $from.parentOffset === 0) {
          // Attempt to sink the list item
          const sinkResult = editor.chain().sinkListItem('listItem').run()

          // If sinking was successful, return true
          if (sinkResult) {
            return true
          }
          // If sinking failed, we'll fall through to inserting a tab
        }

        // Insert a tab character
        editor
          .chain()
          .command(({ tr }) => {
            tr.insertText(TAB_CHAR)
            return true
          })
          .run()

        // Prevent default behavior (losing focus)
        return true
      },
      'Shift-Tab': ({ editor }) => {
        const { selection, doc } = editor.state
        const { $from } = selection
        const pos = $from.pos

        // Check if we're at the start of a list item
        if (editor.isActive('listItem') && $from.parentOffset === 0) {
          // If so, lift the list item
          return editor.chain().liftListItem('listItem').run()
        }

        // Check if the previous character is a tab
        if (doc.textBetween(pos - 1, pos) === TAB_CHAR) {
          // If so, delete it
          editor
            .chain()
            .command(({ tr }) => {
              tr.delete(pos - 1, pos)
              return true
            })
            .run()
          return true
        }

        // Prevent default behavior (losing focus)
        return true
      },
      'Backspace': () => this.editor.commands.outdent(true),
    }
  },
})
const clamp = (val: number, min: number, max: number): number => (val < min ? min : val > max ? max : val)

function update({ step = 1, min = 0, max = Number.POSITIVE_INFINITY, unit = '' } = {}): (
  v: string | number,
  delta?: number,
) => string {
  return (last, delta = step) => {
    let n

    // TODO CSSNumericValue.parse Chrome only 66+
    //  polyfill https://github.com/csstools/css-typed-om
    if (last === undefined || last === null) {
      n = 0
    }
    else if (typeof last === 'number') {
      n = last
    }
    else {
      // will 16rem -> 16
      n = Number.parseFloat(last)
      if (Number.isNaN(n)) {
        n = 0
      }
    }
    n += delta
    n = clamp(n, min, max)
    let frac = 0
    const abs = Math.abs(delta)
    if (abs >= 1) {
      console.log('abs', abs)
    }
    else if (abs >= 0.1) {
      frac = 1
    }
    else if (abs >= 0.01) {
      frac = 2
    }
    else if (abs >= 0.001) {
      frac = 3
    }
    else {
      frac = 4
    }

    return `${n.toFixed(frac)}${unit}`
  }
}
