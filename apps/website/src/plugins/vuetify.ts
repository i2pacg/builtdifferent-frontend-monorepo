/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import { createVuetify } from 'vuetify'

// Composables
import type { ThemeDefinition } from 'vuetify'
import icons from './icons'
// Styles
import 'vuetify/styles'

const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#eb2e1a',
    facebook: '#4267b2',
    whatsapp: '#128c7e',
    twitter: '#1da1f2',
    youtube: '#c4302b',
  },
}

const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#eb2e1a',
    facebook: '#4267b2',
    whatsapp: '#128c7e',
    twitter: '#1da1f2',
    youtube: '#c4302b',
  },
}
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons,
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
