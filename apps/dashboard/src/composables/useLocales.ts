import type { Language } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import type { DefaultLocaleMessageSchema } from 'vue-i18n'
import { LanguageRepository } from '@/data/repositories/languageRepository'
import { StaticContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { getActivePinia } from 'pinia'

export function useLocales() {
  const activePinia = getActivePinia()
  const languages: ComputedRef<Language[]> = computed(() => {
    if (activePinia) {
      const languageRepo = useRepo(LanguageRepository)
      return languageRepo.all()
    }
    else {
      return window.languages as Language[]
    }
  })

  const codeToId = (code: string) => languages.value.find(lang => lang.code === code)?.id
  const idToCode = (id: number) => languages.value.find(lang => lang.id === id)?.code
  const getByCode = (code: string) => languages.value.find(lang => lang.code === code)
  const messages: DefaultLocaleMessageSchema = window.staticContent.map(content => new StaticContent(content).messages).reduce((acc, curr) => {
    Object.entries(curr).forEach(([lang, translations]) => {
      if (!acc[lang])
        acc[lang] = {}
      Object.assign(acc[lang], translations)
    })
    return acc as DefaultLocaleMessageSchema
  }, {}) as DefaultLocaleMessageSchema

  const currentLanguage: ComputedRef<Language | undefined> = computed<Language | undefined>(() => {
    return getByCode('en')
    /*  const { preferences: { language } } = useAppStore()
    return getByCode(language) || getByCode('en') */
  })

  const defaultLanguage: ComputedRef<Language | undefined> = computed(() => {
    return languages.value.find(lang => lang.code === 'en')
  })

  return { languages, messages, codeToId, idToCode, getByCode, currentLanguage, defaultLanguage }
}
