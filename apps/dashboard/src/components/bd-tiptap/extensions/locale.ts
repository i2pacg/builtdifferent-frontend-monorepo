/* eslint-disable unused-imports/no-unused-vars */
import type { Translations } from '@i2pacg/builtdifferent-frontend-tsdata'
// types.ts
// locale-extension.ts
import axiosInstance from '@/plugins/axios'
import { Extension } from '@tiptap/core'
// locale-extension.ts

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    localeManager: {
      setLocale: (locale: string) => ReturnType
      setTranslations: (translations: Translations) => ReturnType
      hasTranslation: (key: string) => ReturnType
      updateTranslation: (locale: string, content: string) => ReturnType
      translate: (locale: string, source: string) => ReturnType
    }
  }
}
interface TranslationContent {
  [key: string]: string // locale: html content
}

interface LocaleExtensionStorage {
  currentLocale: string
  translations: Translations
  isTranslating: boolean
}

interface LocaleChangeDetail {
  previousLanguage: string
  currentLanguage: string
}

interface TranslationStatus {
  [key: string]: {
    hasContent: boolean
    lastUpdated: number
  }
}

interface LocaleExtensionStorage {
  currentLocale: string
  translations: TranslationContent
  translationStatus: TranslationStatus
  isTranslating: boolean
}

interface LocaleChangeDetail {
  previousLanguage: string
  currentLanguage: string
}

export const LocaleManagerExtension = Extension.create({
  name: 'localeManager',

  addOptions() {
    return {
      defaultLocale: 'en',
      supportedLocales: ['en'],
      onChange: (detail: LocaleChangeDetail) => null,
      onTranslationUpdate: (locale: string, content: boolean) => null,
    }
  },

  addStorage() {
    return {
      currentLocale: this.options.defaultLocale,
      translations: {},
      translationStatus: {},
      isTranslating: false,
    } as LocaleExtensionStorage
  },

  addCommands() {
    return {
      setTranslations: (translations: TranslationContent) => ({ commands }) => {
        this.storage.translations = translations

        // Update translation status for all locales
        const newStatus: TranslationStatus = {}
        Object.entries(translations).forEach(([locale, content]) => {
          newStatus[locale] = {
            hasContent: !!content?.trim(),
            lastUpdated: Date.now(),
          }
        })
        this.storage.translationStatus = newStatus

        return true
      },

      updateTranslation: (locale: string, content: string) => ({ commands }) => {
        this.storage.translations = {
          ...this.storage.translations,
          [locale]: content,
        }

        // Update status for this locale
        this.storage.translationStatus = {
          ...this.storage.translationStatus,
          [locale]: {
            hasContent: !!content?.trim(),
            lastUpdated: Date.now(),
          },
        }

        this.options.onTranslationUpdate?.(locale, content?.trim())
        return true
      },

      setLocale: (locale: string) => ({ commands }) => {
        if (!this.options.supportedLocales?.includes(locale)) {
          console.warn(`Locale ${locale} is not supported`)
          return false
        }

        const changeDetail: LocaleChangeDetail = {
          previousLanguage: this.storage.currentLocale,
          currentLanguage: locale,
        }

        this.storage.currentLocale = locale
        this.options.onChange?.(changeDetail)
        return true
      },

      hasTranslation: (locale: string) => () => {
        return this.storage.translationStatus[locale]?.hasContent ?? false
      },

      translate: (locale: string, source: string) => () => {
        /*
        const axios = require('axios');

        const options = {
          method: 'POST',
          url: 'https://translateai.p.rapidapi.com/detect',
          headers: {
            'x-rapidapi-key': '08b5573755mshf7c3a3c23a37373p1bdccajsn9e379e9c7dba',
            'x-rapidapi-host': 'translateai.p.rapidapi.com',
            'Content-Type': 'application/json'
          },
          data: {
            input_text: 'This sentence is written in English. Let's detect it with the API and see what it says.'
          }
        };

        try {
          const response = await axios.request(options);
          console.log(response.data);
        } catch (error) {
       url: 'https://translateai.p.rapidapi.com/google/translate/html',
    console.error(error);
        } */
        axiosInstance.post(`https://translateai.p.rapidapi.com/google/translate/html`, {
          html_content: this.storage.translations[source],
          target_language: locale,
        }, {
          headers: {
            'x-rapidapi-key': '08b5573755mshf7c3a3c23a37373p1bdccajsn9e379e9c7dba',
            'x-rapidapi-host': 'translateai.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          this.editor.commands.updateTranslation(locale, response.data.translation)
        }).catch((error) => {
          console.error(error)
        })

        return true
      },
    }
  },
})
