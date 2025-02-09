/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
declare global {
  interface Window {
    languages: Language[]
    staticContent: StaticContent[]
  }
}
