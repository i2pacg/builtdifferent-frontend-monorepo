import type { InternalBreadcrumbItem } from '@/interfaces'
import type { User } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import type { Constructor, Model } from 'pinia-orm'
import type { Ref } from 'vue'
import { LOG_STORES_COLOR } from '@/constants'
import { EntityPreferences, Preferences } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { pausableWatch, useDebounceFn } from '@vueuse/core'
import { defineStore } from 'pinia'

interface AppStore {
  isReady: Ref<boolean>
  setUser: (user?: User) => void
  user: Ref<User | undefined>
  getEntityPreferences: (model: Constructor<Model>, entity: string) => EntityPreferences
  breadcrumbs: Ref<InternalBreadcrumbItem[]>
  htmlContentItems: Ref<InternalBreadcrumbItem[]>
  lastCheckTime: Ref<number | null>
}

const useAppStore = defineStore('app', () => {
  const user: Ref<User | undefined> = ref()
  const lastCheckTime: Ref<number | null> = ref(null)

  const preferences: Ref<Preferences> = ref(Preferences.default())

  const isReady = ref(true)

  const { pause, resume } = pausableWatch(() => preferences.value, useDebounceFn((oldPreferences, newPreferences: Preferences) => {
    if (JSON.stringify(newPreferences) === JSON.stringify(user.value!.preferences))
      return

    useApiRequest<boolean>(`/api/users/preferences/${user.value?.id}`)
      .update({ preferences: newPreferences })
      .then(() => { console.log('main', 'Preferences updated successfully') })
      .catch(error => console.log('main', 'Error updating preferences', { error }))
  }, 300), { deep: true, immediate: false })

  const getEntityPreferences = (model: Constructor<Model>, entity: string): EntityPreferences => {
    pause()
    preferences.value.entities[entity] = EntityPreferences.for(model, user.value!.preferences.entities[entity])
    nextTick(resume)
    return preferences.value.entities[entity]
  }

  const setUser = (authUser?: User): void => {
    pause()
    console.log(`%c[AppStore] %cSetting user`, LOG_STORES_COLOR, 'color:white', authUser)
    user.value = authUser
    lastCheckTime.value = authUser ? Date.now() : null
    nextTick(resume)
  }

  const breadcrumbs: Ref<InternalBreadcrumbItem[]> = ref([])
  const htmlContentItems: Ref<InternalBreadcrumbItem[]> = ref([])
  // deep watch preferences

  const appStore: AppStore = {
    user,
    setUser,
    isReady,
    getEntityPreferences,
    breadcrumbs,
    htmlContentItems,
    lastCheckTime,
  }
  return appStore
})

export default useAppStore
