/* eslint-disable import/first */
const startTime = performance.now()

/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

import pinia from '@/data/stores'
import { vHighlight } from '@/directives/highlight'
import { Language, StaticContent, User } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import VueDatePicker from '@vuepic/vue-datepicker'
import { setActivePinia } from 'pinia'
import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
// @ts-expect-error missing types for vue-timeago3 //TODO: Fix this
import timeago from 'vue-timeago3'
import Toast from 'vue-toastification'
import App from './App.vue'
import i18n from './plugins/i18n'
import vuetify from './plugins/vuetify'
import router from './router'
import '@vuepic/vue-datepicker/dist/main.css'
import 'vue-final-modal/style.css'
import 'vue-toastification/dist/index.css'

const components = import.meta.glob('./components/form/*Field.vue', { eager: true })

declare global {
  interface Window {
    languages: Language[]
    staticContent: StaticContent[]
    user?: User
  }
}

const app = createApp(App)
const vfm = createVfm()
/*
const models = import.meta.glob('@i2pacg/builtdifferent-frontend-tsdata/models', { eager: true })
console.log(`%c[main.ts] %cModels`, LOG_FILES_COLOR, 'color: #f00', models) */
app.use(pinia)
setActivePinia(pinia)
useRepo(Language).save(window.languages)
useRepo(StaticContent).save(window.staticContent)

if (window.user) {
  useAppStore().setUser(new User(window.user))
}

Object.entries(components).forEach(([path, definition]) => {
  const componentName = path
    .split('/')
    .pop()!
    .replace(/\.\w+$/, '')
  app.component(componentName, (definition as any).default)
})
app.component('VueDatePicker', VueDatePicker)

app.directive('highlight', vHighlight)
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(timeago)
app.use(vfm)
app.use(Toast)

// app.config.globalProperties.$logger = logger

app.mount('#app')

const loadTime = performance.now() - startTime
console.log(`App initialized in ${loadTime} ms`)
