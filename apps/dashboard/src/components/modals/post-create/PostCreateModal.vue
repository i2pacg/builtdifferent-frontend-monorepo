<script setup lang="ts">
import type { ModelStatic, PostCreateOption } from '@/interfaces'
import type { TableKey } from '@/interfaces/preferences/admin/tables'
import type { Constructor, Model } from 'pinia-orm'
import { hasSlug, keyOrDefault } from '@/helpers'
import { VueFinalModal } from 'vue-final-modal'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    name?: string
    item: Model
    entity: TableKey
  }>(),
  {
    loading: false,
    name: '',
  },
)
const emit = defineEmits<{
  (e: 'option', option: PostCreateOption): void
}>()
const { t } = useI18n()

const { mediaCollections, fields } = useCrudAdv(props.entity)
onMounted(() => {
  /* console.log('mounted', props.model.mediaCollections) */
})
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
    <v-card min-width="420px">
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
        {{ t(`entities.${entity}.actions.create.success`, { name }) }}
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="tonal"
          :to="`/entities/${props.entity}/${keyOrDefault(item, 'slug', '')}`"
        >
          More Edits
        </v-btn>
        <v-btn
          v-if="fields.some(f => f.type === 'html')"
          variant="tonal"
          :to="`/entities/${props.entity}/${keyOrDefault(item, 'slug', '')}/content`"
        >
          content
        </v-btn>
        <v-btn
          v-if="mediaCollections"
          variant="tonal"
          :to="`/entities/${props.entity}/${keyOrDefault(item, 'slug', '')}/media`"
        >
          Media
        </v-btn>
        <v-spacer />
        <v-btn @click="emit('option', 'done')">
          Done
        </v-btn>
        <v-btn @click="emit('option', 'another')">
          add another
        </v-btn>
      </v-card-actions>
    </v-card>
  </vue-final-modal>
</template>
