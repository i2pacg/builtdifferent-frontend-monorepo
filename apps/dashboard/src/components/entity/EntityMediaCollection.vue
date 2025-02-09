<template>
  <v-sheet
    v-for="_, key in getCollectionMediaTypes(collection)"
    :key="key"
    width="85%"
    border="sm"
    rounded="lg"
    class="position-relative mx-auto mb-4 py-4"
  >
    <v-list-item>
      <template #title>
        <h4 class="text-capitalize">
          {{ collection }}
        </h4>
      </template>
      <template #append>
        <small v-if="mediaCollection?.maxFiles && mediaCollection?.maxFiles > 1" class="font-weight-bold">
          {{ getCollectionMedia(collection).length }}  {{ mediaCollection?.maxFiles ? `/ ${mediaCollection?.maxFiles}` : '' }}
        </small>
        <v-btn
          size="small"
          variant="tonal"
          :prepend-icon="mediaCollection?.maxFiles && mediaCollection.maxFiles > 1 ? '$mdi-plus' : '$mdi-reload'"
          class="ms-2"
          @click="onAddMedia"
        >
          <span>{{ mediaCollection?.maxFiles && mediaCollection.maxFiles > 1 ? 'Add' : 'replace' }}</span>
        </v-btn>
      </template>
    </v-list-item>

    <!--   <bd-swiper
        v-if="getCollectionMedia(collection).length"
        :items="getCollectionMedia(collection)"
      /> -->

    <!--  <entity-media-file
      v-if="mediaCollection?.maxFiles === 1 && getCollectionMedia(collection).length"
      :media="getCollectionMedia(collection)[0]"
      :show-properties="true"
      @delete="onDeleteMedia"
    />
 -->
    <bd-swiper
      :items="getCollectionMedia(collection)"
      min-height="200px"
      :auto="5000"
      :speed="2000"
      :mousewheel="false"
      :navigation="false"
      :pagination="false"
      :allow-slide-click="false"
      :slides-per-view="4"
      :space-between="16"
      :centered-slides="getCollectionMedia(collection).length === 1"
    >
      <template #default="{ item } : {item: Media}">
        <entity-media-file :media="item" :show-properties="true" />
      </template>
    </bd-swiper>
  </v-sheet>
</template>

<script setup lang="ts">
import type { Media } from '@/data/models/media.model'
import { getMediaTypeByMimeType } from '@/constants'
import { BdSwiper } from '@i2pacg/bd-vue'
import { useModal } from 'vue-final-modal'
import AddMediaModal from '../modals/add-media/AddMediaModal.vue'

const props = defineProps<{
  collection: string
  entity: string
  slug: string
}>()
const { t } = useI18n()
const { getMediaCollection, getCollectionMedia, getCollectionMediaTypes, addMedia } = useEntityMedia(props.entity, props.slug)
function onAddMedia() {
  console.log('onAddMedia')
  const { open } = useModal({
    component: AddMediaModal,
    attrs: {
      onAdd: (media: File | File[]) => {
        console.log('onAdd', media)
        addMedia(media, props.slug, props.collection)
      },
    },
  })
  open()
}
const mediaCollection = computed(() => getMediaCollection(props.collection))

console.log('EntityMediaCollection', getCollectionMedia(props.collection), getCollectionMediaTypes(props.collection))

function onDeleteMedia(media: Media) {
  console.log('onDeleteMedia', media)
  // emit('delete', media)
}
</script>
