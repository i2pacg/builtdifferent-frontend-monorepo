import type { Language } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { LOG_COMPOSABLES_COLOR } from '@/constants'
import { LanguageRepository } from '@/data/repositories/languageRepository'
import { getActivePinia } from 'pinia'

export function useLanguages(): Language[] {
  const activePinia = getActivePinia()
  if (activePinia) {
    const languageRepo = useRepo(LanguageRepository)
    const languages = languageRepo.all()
    console.log('%c[useLanguages] %c[Pinia]', LOG_COMPOSABLES_COLOR, 'color: #ffffff', languages)
    return languages
  }
  else {
    const languages = window.languages as Language[]
    console.log('%c[useLanguages] %c[Window]', LOG_COMPOSABLES_COLOR, 'color: #ffffff', languages)
    return languages
  }
}
