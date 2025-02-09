/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import type { ThemeDefinition } from 'vuetify'

import i18n from '@/plugins/i18n'
import { useI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import { VCol, VRow, VSlider } from 'vuetify/components'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import icons from './icons'
// Styles
import 'vuetify/styles'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    facebook: '#4267b2',
    whatsapp: '#128c7e',
    twitter: '#1da1f2',
    youtube: '#c4302b',
    inactive: '#b0bec5',
  },
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#6EC6FF', // Lighter blue for better contrast
    facebook: '#4267B2',
    whatsapp: '#25D366',
    twitter: '#1DA1F2',
    youtube: '#FF0000',
    error: '#FF5252',
    inactive: '#757575', // Darker gray for better visibility
  },
}
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons,
  components: { VRow, VCol, VSlider },
  locale: {
    messages: i18n.global.messages.value,
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    defaultTheme: 'dark',
    variations: {
      colors: ['primary', 'secondary', 'error', 'info', 'success', 'warning', 'surface', 'background'],
      lighten: 5,
      darken: 5,
    },
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
})
