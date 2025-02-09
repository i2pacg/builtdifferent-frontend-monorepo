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
    <v-sheet
      width="640px"
      max-height="90vh"
    >
      <bd-file-input
        v-model="media"
        max-height="480"
        :rules="{
          fileType: 'image/*',
        }"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!media || Array.isArray(media) && !media.length"
          @click="emit('add', media!)"
        >
          ADD
        </v-btn>
      </v-card-actions>
    </v-sheet>
  </vue-final-modal>
</template>
