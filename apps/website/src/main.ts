/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import pinia from '@/data/stores'

// Plugins
import { registerPlugins } from '@/plugins'

import { useStorage } from '@vueuse/core'
import { useRepo } from 'pinia-orm'
// Composables
import { createApp } from 'vue'
// Components
import App from './App.vue'
import { Category } from './data'

const app = createApp(App)
app.use(pinia)

useRepo(Category).save(useStorage('categories', [] as Category[]).value)

registerPlugins(app)

app.mount('#app')
