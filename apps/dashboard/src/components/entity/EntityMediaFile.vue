<script setup lang="ts">
import type { CustomProperties } from '@/data/models/customProperties.model'
import type { Media } from '@/data/models/media.model'
import type {
  AllowedTypeWithRules,
  FileValidationStatus,
} from '@i2pacg/bd-vue'

import { objectOmit } from '@vueuse/core'
import { useModal } from 'vue-final-modal'

const props = defineProps<{
  media: Media
  rules?: AllowedTypeWithRules
  withProperties?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:validationStatus', fileValidationStatus: FileValidationStatus): void
  (e: 'update', data: string): void
  (e: 'update:customProperties', customProperties: CustomProperties): void
  (e: 'close'): void
}>()
const { deleteMedia } = useMedia('media')
/* const fileValidationStatus = ref<FileValidationStatus>('pending') */
const fileExtraProps = ref<Record<string, unknown>>()
/* const isImageRules = (file: AllowedTypeWithRules): file is ImageFileType => file.fileType === 'image/*' */

const { t } = useI18n()
const { isRtl } = useLocale()
const newProperty = reactive({
  enabled: false,
  name: '',
  value: '',
})
const requiredDimensions = computed(() => {
  /*  if (isImageRules(props.rules!) && props.rules!.dimensions)
    return props.rules!.dimensions */

  return null
})
const currentDimensions = computed(() => {
/*   if (isImageRules(props.rules!) && fileExtraProps.value)
    return fileExtraProps.value.dimensions as ImageDimensions */

  return null
})
watch(
  () => props.media,
  () => {
    console.log(':::watch MEDIA CHANGED', props.media)
    nextTick(() => {
      initImage(props.media.originalUrl)
    })
  },
)
const { originalUrl } = toRefs(props.media)
watch(
  () => originalUrl.value,
  (v) => {
    console.log(':::watch originalUrl', props.media)
    initImage(v)
  },
)

function initImage(url: string) {
  /* fileValidationStatus.value = 'pending' */
  console.log(':::initImage', url, props.rules)
}

function onEdit() {
  console.log(':::onEdit', props.media)
  /*  const { open: openForm, close } = useModal({
    component: BdEditImageModal,
    attrs: {
      image: props.media.originalUrl,
      requiredDimensions: requiredDimensions.value,
      onClose: () => {
        close().catch(console.error)
      },
      onUpdate: (result: UpdateDataProps) => {

        emit('update', result.data)
      },
      onConfirm: (data: string) => {
        emit('update', data)
        nextTick(() => {
          close().catch(console.error)
        })
      },
    },
  })
  openForm().catch(console.error) */
}
function newCustomProperty() {
  console.log(':::newCustomProperty', newProperty)
  const data = props.media.customProperties
  data[newProperty.name] = newProperty.value
  newProperty.enabled = false
  newProperty.name = ''
  newProperty.value = ''
  emit('update:customProperties', data)
}
function onUpdateCustomProperty(event) {
  const { value, name } = event.target
  console.log(':::onUpdateCustomProperty', event, value, name)
  const data = props.media.customProperties
  data[name] = value
  emit('update:customProperties', data)
}
onMounted(() => {
  initImage(props.media.originalUrl)
})
const showProperties = ref(false)
watch(
  () => showProperties.value,
  (v) => {
    if (!v) {
      newProperty.enabled = false
    }
  },
)
</script>

<template>
  <table
    variant="outlined"
  >
    <tbody>
      <tr>
        <td>
          <img
            :src="media.originalUrl"
            width="auto"
            :style="{
              maxWidth: '100%',
              objectFit: 'contain',
            }"
          >
        </td>
      </tr>
      <tr>
        <td>
          <v-expand-transition>
            <v-sheet
              v-if="showProperties"
              color="transparent"
            >
              <v-text-field
                v-for="(value, key) in media.customProperties"
                :key="key"
                :model-value="value"
                hide-details
                density="compact"
                :name="key.toString()"
                variant="solo-filled"
                class="mb-1"
                width="100%"
                @input="onUpdateCustomProperty"
              >
                <template #label>
                  <small>{{ t(`entities.media.customProperties.properties.${key}.title`) }}</small>
                </template>
                <template #prepend-inner>
                  <v-icon icon="$mdi-alert-circle" size="16" />
                </template>
              </v-text-field>
            </v-sheet>
          </v-expand-transition>
        </td>
      </tr>
      <tr>
        <td>
          <v-expand-transition>
            <v-text-field
              v-if="newProperty.enabled"
              v-model="newProperty.name"
              label="New Property name"
              hide-details
              density="compact"
              variant="solo-filled"
              class="mb-1"
            >
              <template
                v-if="newProperty.name.length > 0"
                #append-inner
              >
                <v-btn
                  icon
                  :rounded="0"
                  variant="tonal"
                  density="compact"
                  @click="newCustomProperty"
                >
                  <v-icon icon="$mdi-chevron-right" />
                </v-btn>
              </template>
            </v-text-field>
          </v-expand-transition>
          <div class="d-flex mt-2">
            <v-btn
              v-if="showProperties"
              size="x-small"
              variant="tonal"
              @click="newProperty.enabled = !newProperty.enabled"
            >
              Property
              <v-icon>$mdi-plus</v-icon>
            </v-btn>
            <v-btn
              v-else
              prepend-icon="$mdi-trash-can"
              text="delete"
              size="x-small"
              color="error-lighten-2"
              variant="tonal"
              :rounded="0"
              @click="deleteMedia([media.id])"
            />
            <v-spacer />
            <v-btn
              size="x-small"
              variant="tonal"
              :rounded="0"
              @click="showProperties = !showProperties"
            >
              <v-icon :icon="showProperties ? '$mdi-chevron-up' : '$mdi-information-outline'" />
            </v-btn>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
