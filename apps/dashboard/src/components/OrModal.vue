<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
  isModal?: boolean
  loading?: boolean
}>()
</script>

<template>
  <vue-final-modal
    v-if="isModal"
    :click-to-close="true"
    content-transition="vfm-slide-up"
    overlay-transition="vfm-fade"
    :z-index-fn="() => 3000"
    show-swipe-banner
    class="d-flex align-center justify-center"
  >
    <v-card
      width="640px"
      max-height="90vh"
      class="overflow-y-auto"
      :loading="loading"
      :disabled="loading"
    >
      <slot />
    </v-card>
  </vue-final-modal>
  <slot v-else />
</template>
