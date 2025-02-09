<script setup lang="ts"  generic=" T extends Model">
import type { I18nProperty } from '@i2pacg/bd-vue-utils'
import type { Model } from 'pinia-orm'
import { hasName, keyOrDefault } from '@/helpers'
import { VueFinalModal } from 'vue-final-modal'
import {
  VBtn,
  VCard,
  VCardActions,
  VList,
  VListItem,
  VSheet,
} from 'vuetify/components'

/* export interface BdMenuItemFormParams {
  title: I18nProperty
  link: string
  icon: string
} */
export type DeleteStatus = 'idle' | 'loading' | 'success' | 'error'
const props = withDefaults(defineProps<{
  model?: ModelStatic
  status?: DeleteStatus
  items?: T[]
}>(), { status: 'idle' })

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'close'): void
}>()
onMounted(() => {})

function getLabel(item: T) {
  if (hasName(item))
    return item.name.toString()
  return keyOrDefault(item, 'id', -1)
}
const { t } = useI18n()
if (!props.model)
  throw new Error('model are required')
const { entity } = useCrud(props.model)

console.log('DeleteModal')
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
    <v-sheet id="formDialog">
      <v-card
        height="100%"
        width="500px"
        color="warning"
        variant="outlined"
        :loading="status === 'loading'"
        :disabled="status === 'loading'"
      >
        <v-list-item
          density="compact"
          append-icon="mdi-alert-circle"
          :subtitle="t('actions.deleteWarning')"
        >
          <template #title>
            <i18n-t
              v-if="items"
              scope="global"
              keypath="actions.delete"
              class="t-overline"
              tag="h2"
              :entity="entity"
            >
              <template #entity>
                <i18n-t
                  :keypath="`entities.${entity}.count`"
                  :plural="items.length"
                  scope="global"
                  tag="span"
                >
                  <template #count>
                    <strong>
                      {{ items.length }}
                    </strong>
                  </template>
                </i18n-t>
              </template>
            </i18n-t>
          </template>
        </v-list-item>

        <v-list density="compact">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            :title="getLabel(item)"
            density="compact"
          />
        </v-list>
        <v-card-actions
          v-if="status !== 'success'"
          class="justify-end"
        >
          <v-btn
            variant="tonal"
            :text="t('actions.cancel')"
            @click="emit('close')"
          />
          <v-btn
            variant="tonal"
            :text="t('actions.delete')"
            @click="emit('confirm')"
          />
        </v-card-actions>
      </v-card>
    </v-sheet>
  </vue-final-modal>
</template>
