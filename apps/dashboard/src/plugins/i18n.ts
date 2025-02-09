import type { Language } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import type { DefaultLocaleMessageSchema, I18nOptions, VueMessageType } from 'vue-i18n'

import { useLocales } from '@/composables/useLocales'
import { createI18n } from 'vue-i18n'

const { languages, messages } = useLocales()
const availableLocales = languages.value.map((l: Language) => l.code)

function customRule(choice: number): number {
  const lesTeen = choice <= 10 && choice > 2
  if (choice === 0) {
    return 0
  }
  if (choice === 1) {
    return 1
  }
  if (choice === 2) {
    return 2
  }
  if (lesTeen) {
    return 3
  }
  return 4
}

const options: I18nOptions = {
  // @ts-expect-error messages is not a valid option TODO: Fix this
  messages,
  legacy: false,
  locale: 'en',
  availableLocales,
  missingWarn: false,
  pluralRules: {
    ar: customRule,
  },
  modifiers: {
    arNumber: (str: VueMessageType) => {
      return Intl.NumberFormat('ar-EG').format(Number.parseInt(str.toString(), 10))
    },
  },
  numberFormats: {
    'en-US': {
      normal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
    'ar-EG': {
      normal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      },
      currency: {
        style: 'currency',
        currency: 'EGP',
        useGrouping: true,
        currencyDisplay: 'symbol',
      },
      decimal: {
        style: 'decimal',
        minimumSignificantDigits: 3,
        maximumSignificantDigits: 5,
      },
      percent: {
        style: 'percent',
        useGrouping: false,
      },
    },
    'zh-CN': {
      currency: {
        style: 'currency',
        currency: 'CNY',
        currencyDisplay: 'symbol',
      },
    },
  },
}

const i18n = createI18n<false, typeof options, DefaultLocaleMessageSchema>(options)
export default i18n
