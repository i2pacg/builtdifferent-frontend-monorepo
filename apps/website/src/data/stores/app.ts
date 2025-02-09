import { defineStore } from 'pinia'
import type { Ref } from 'vue'

interface AppStore {
  loading: Ref<boolean>
  isReady: Ref<boolean>
  init: () => Promise<void>
}

const useAppStore = defineStore('app', () => {
  const loading = ref(false)
  const isReady = ref(true)
  const init = async () => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false
  }
  const appStore: AppStore = {
    loading,
    isReady,
    init,
  }
  return appStore
})

export default useAppStore
