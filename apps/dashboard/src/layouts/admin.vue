<script lang="ts" setup>
import { ModalsContainer } from 'vue-final-modal'

const { global } = useTheme()
/* const { preferences } = useAppStore()
const { theme } = toRefs(preferences) */

watch(() => global.name.value, (newTheme) => {
  console.log('theme changed ss', newTheme)
  /* theme.value = newTheme */
})
</script>

<template>
  <app-drawer />
  <suspense>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </suspense>
  <modals-container />
</template>
