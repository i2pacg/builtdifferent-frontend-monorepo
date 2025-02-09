<script setup lang="ts">
import type { PostUpdateOption } from '@/interfaces'

withDefaults(
  defineProps<{
    loading?: boolean
    name?: string
    model?: string
  }>(),
  {
    loading: false,
    name: '',
    model: '',
  },
)
const emit = defineEmits<{
  (e: 'option', option: PostUpdateOption): void
}>()
const { t } = useI18n()
</script>

<template>
  <v-card>
    <v-list-item>
      <v-list-item-title> Whats next? </v-list-item-title>
      <template #append>
        <i-mdi-check-circle
          color="rgb(var(--v-theme-success))"
          font-size="42px"
        />
      </template>
    </v-list-item>
    <v-card-text>
      {{ t(`entities.${model}.actions.update.success`, { name }) }}
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-spacer />
      <v-btn @click="emit('option', 'more')">
        More Edits
      </v-btn>
      <v-btn @click="emit('option', 'close')">
        done
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
