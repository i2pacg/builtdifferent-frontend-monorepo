/* import type { App, Plugin } from 'vue'
import type { PluginOptions } from './types/plugin'
import { defu } from 'defu'
import { DefaultPluginOptions } from './constants' */

export * from './models'
export * from './types'
/* export function useBdData(pluginOptions: PluginOptions): Plugin {
  const options = defu(pluginOptions, DefaultPluginOptions)
  return {
    install: (app: App) => {
      console.log('installing plugin', options.showLogs, app)
    },
  }
}
 */
