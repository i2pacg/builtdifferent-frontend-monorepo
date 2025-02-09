/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types
import type { App } from 'vue'

import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'
import router from '../router'
// Plugins
import vuetify from './vuetify'

export function registerPlugins(app: App) {
  app
    .use(vuetify)
    .use(DataLoaderPlugin, { router })
    .use(router)
}
