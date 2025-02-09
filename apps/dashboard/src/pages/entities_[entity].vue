<script setup lang="ts">
import { LOG_VIEWS_COLOR } from '@/constants'
import { loadModelClasses } from '@/utils/loadModelClasses'
// @ts-expect-error - Ignore error until Vue 3.2
import { VueEllipsis3 } from 'vue-ellipsis-3'

import { VBreadcrumbs, VBreadcrumbsItem } from 'vuetify/components'

const props = defineProps<{
  entity: string
  slug?: string
  field?: string
}>()

const data = shallowRef<Entity>()
const error = ref<Error>()

function loadEntity(entityName: string) {
  try {
    error.value = undefined
    const model = loadModelClasses(entityName)
    return useEntity(model)
  }
  catch (e) {
    error.value = e as Error
    throw e
  }
}

// Initial load
try {
  data.value = loadEntity(props.entity)
}
catch (e) {
  console.error('Failed to load entity:', e)
}

// Watch for entity changes
watch(() => props.entity, (newEntity) => {
  console.log(`%c[Entities] %cChanged: ${newEntity}`, LOG_VIEWS_COLOR, 'color: #00d1b2')
  try {
    data.value = loadEntity(newEntity)
  }
  catch (e) {
    console.error('Failed to load new entity:', e)
  }
})

const breadcrumbs = ref([])

function onAdd() {
  console.log('Add')
  // ...existing code...
  /* const { close, open } = useModal({
    component: BdFields,
    attrs: {
      model: data.value.model,
      isModal: true,
      onConfirm: async (item: any) => {
        try {
          const response = await useAxiosRepo(data.value.model).api().post(`/api/entities/${data.value.entityName}`, item, { save: true })
          console.log('Response:', response)
        } catch (error) {
          console.error('Error:', error)
        }
        close()
      },
    },
  })
  open() */
}

// Error boundary handler
onErrorCaptured((err) => {
  console.error('Error: captured', err)
  error.value = err as Error
  return false
})
</script>

<template>
  <div class="d-flex h-100 position-relative">
    <!-- <modals-container /> -->

    <!-- <entity-nav-bar
      :entity="data?.entityName || entity"
      :slug="slug"
      :page="field"
      :model-name="useChangeCase(entity, 'camelCase').value"
      :breadcrumbs="breadcrumbs"
      :html-content-items="htmlContentItems"
      @add="onAdd"
    /> -->

    <!--     <pre>{{ Object.keys(data?.fields!) }}</pre>
    <pre>{{ Object.keys(data?.columns!) }}</pre> -->
    <v-app-bar
      color="background"
      flat
      :extension-height="24"
      :elevation="0"
      density="compact"
      order="3"
    >
      <v-breadcrumbs
        :items="breadcrumbs"
        density="compact"
      >
        <template #item="{ item, index }">
          <v-breadcrumbs-item
            :to="item.to"
            :disabled="item.disabled"
            class="text-capitalize font-weight-bold text-body-1 px-0"
          >
            <vue-ellipsis-3
              :text="item.title"
              reflow-on-resize
              :ellipsis="index === 1"
            />
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

      <v-spacer />
      <div
        class="d-flex align-center fill-height py-4"
      >
        <!--     <div
          v-if="slug"
          class="d-flex"
        >
          <v-divider
            vertical
            class="my-auto mx-2"
          />
          <v-btn
            :disabled="route.name === 'entities.details'"
            :to="`${listRoute}/${slug}`"
            variant="tonal"
            size="small"
            class="me-1"
          >
            Info
          </v-btn>
          <v-divider
            v-if="htmlContentItems && htmlContentItems.length > 0"
            vertical
            class="my-auto mx-1"
          />
          <v-btn
            v-for="(item, key) in (htmlContentItems || [])"
            :key="key"
            :to="item.to"
            size="small"
            variant="tonal"
            :disabled="item.disabled"
          >
            {{ item.title }}
          </v-btn>
          <v-divider
            v-if="htmlContentItems && htmlContentItems.length > 0"
            vertical
            class="my-auto mx-1"
          />
          <v-btn
            :disabled="route.name === 'entities.media'"
            :to="`${listRoute}/${slug}/media`"
            size="small"
            variant="tonal"
          >
            Media
          </v-btn>
          <v-divider
            vertical
            class="my-auto mx-2"
          />
        </div>
 -->
        <v-btn
          icon
          variant="tonal"
          :rounded="false"
          density="compact"
          class="me-2"
          @click="onAdd"
        >
          <v-icon>$mdi-plus</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <router-view v-if="data">
      <template #default="{ Component: routeComponent }">
        <component
          :is="routeComponent"
          :entity="entity"
          :slug="slug"
          :data="data"
          :model="data.model"
          @update-breadcrumbs="breadcrumbs = $event"
        />
      </template>
    </router-view>

    <div v-if="error" class="error-container">
      {{ error.message }}
    </div>
  </div>
</template>

<route lang="json">
{
  "$schema": "https://raw.githubusercontent.com/posva/unplugin-vue-router/main/route.schema.json",
  "name": "entities",
  "path": "/entities/:entity",
  "props": true,
  "meta": {
    "layout": "admin",
    "permissions": ["admin.super"],
    "requiresAuth": true
  }
}
</route>
