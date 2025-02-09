/// <reference types="vite/client" />
declare global {
  interface Window {
    languages: Language[]
    staticContent: StaticContent[]
  }
}
