<script setup lang="ts">
import { BdFileInput } from '@i2pacg/bd-vue'
import { VueFinalModal } from 'vue-final-modal'

const emit = defineEmits<{
  (e: 'add', file: File | File[]): void
}>()

const media = ref<File | File[] | null>(null)
</script>

<template>
  <vue-final-modal
    :click-to-close="false"
    content-transition="vfm-slide-up"
    overlay-transition="vfm-fade"
    :z-index-fn="() => 3000"
    show-swipe-banner
    class="d-flex align-center justify-center"
  >
    <v-card
      width="640px"
      height="480px"
    >
      <bd-file-input
        v-model="media"
        :rules="{
          fileType: 'image/*',
        }"
      />

      {{ media }}
      <v-card-actions>
        <v-btn
          color="primary"
          :disabled="!media"
          @click="emit('add', media!)"
        />
      </v-card-actions>
    </v-card>
  </vue-final-modal>
</template>
