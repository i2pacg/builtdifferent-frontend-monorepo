import type { Element } from 'pinia-orm'
import type { StaticContent } from '.'
import type { LanguageCodes, TextType, Translations } from '../types'
import type Language from './language.model'

declare global {
  interface Window {
    languages: Language[]
    staticContent: StaticContent[]
  }
}

export default class TextContent {
  content: Translations = {} as Translations
  type: TextType = 'text'

  constructor(initialProps?: Element) {
    this.type = initialProps?.type ?? 'text'
    window.languages.forEach(({ code }) => {
      this.content[code as LanguageCodes] = (initialProps?.content && initialProps?.content[code as LanguageCodes]) ?? null
    })
  }

  toString(): string {
    return this.content[window.languages[0].code as LanguageCodes] ?? ''
  }

  get messages(): Record<LanguageCodes, string> {
    return window.languages.reduce((acc, { code }) => {
      if (this.content[code as LanguageCodes])
        acc[code as LanguageCodes] = this.content![code as LanguageCodes] ?? ''
      return acc
    }, {} as Record<LanguageCodes, string>)
  }
}
