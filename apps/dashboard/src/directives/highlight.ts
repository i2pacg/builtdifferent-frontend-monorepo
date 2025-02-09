import type { DirectiveBinding } from 'vue'
import DOMPurify from 'dompurify'

interface HighlightBinding {
  text: string
  query: string
  class?: string
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlight(el: HTMLElement, binding: DirectiveBinding<HighlightBinding>) {
  const { text, query, class: highlightClass = 'highlight-text' } = binding.value
  if (!text || !query) {
    el.innerHTML = DOMPurify.sanitize(text)
    return
  }

  const sanitizedText = DOMPurify.sanitize(text)
  const sanitizedQuery = DOMPurify.sanitize(query)

  const regex = new RegExp(`(${escapeRegExp(sanitizedQuery)})`, 'gi')
  const highlighted = sanitizedText.replace(regex, `<span class="${highlightClass}">$1</span>`)

  el.innerHTML = DOMPurify.sanitize(highlighted, { ADD_ATTR: ['class'] })
}

export const vHighlight = {
  mounted: highlight,
  updated: highlight,
}
