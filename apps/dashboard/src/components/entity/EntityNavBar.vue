<script setup lang="ts">
import type { InternalBreadcrumbItem } from '@/interfaces'
import { VueEllipsis3 } from 'vue-ellipsis-3'
import { VBreadcrumbs, VBreadcrumbsItem } from 'vuetify/components'

const props = defineProps<{
  entity: string
  slug?: string
  page?: string
  modelName: string
  breadcrumbs: InternalBreadcrumbItem[]
  htmlContentItems: InternalBreadcrumbItem[]
}>()
const emit = defineEmits<{
  (e: 'add'): void
}>()

/* const { t } = useI18n() */

/* const entity = computed(() =>
  currentRoute.fullPath.match(/entities\/([^/]*)/)?.[1] || null,
) */

const listRoute = `/entities/${props.entity}`
/* const page = computed(() =>
  currentRoute.name.split('.').length > 2 ? currentRoute.name.split('.')[2] : null,
) */
/* const breadcrumbsItems = asyncComputed(async () => {
  console.log('Current Route', ' -  ', currentRoute.fullPath, ' - ', props.page)

  const c = [
    {
      disabled: currentRoute.path === listRoute,
      title: t(`entities.${props.modelName}.title`),
      to: { path: listRoute },
    },
  ]
  if (props.slug) {
    const { item, fetchItem } = useEntityDetails(props.entity, props.slug)
    console.log('has slug', props.slug, ' - ', item.value)
    if (!item.value) {
      console.log('No Item found , trying api')
      await fetchItem()
    }
    console.log('Item', item.value)
    if (item.value) {
      console.log('Got Item from useEntityDetails', item.value)
      c.push({
        title: hasKey<Constructor<Model>>(item.value, 'name') ? item.value.name.toString() : props.slug,
        to: { path: `${listRoute}/${props.slug}` },
        disabled: !props.page,
      })
    }
  }

  if (props.page) {
    c.push({
      title: props.page,
      to: { path: currentRoute.path },
      disabled: true,
    })
  }
  return c
}) */

const route = useRoute()
</script>

<template>
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
      <div
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

      <v-btn
        icon
        variant="tonal"
        :rounded="false"
        density="compact"
        class="me-2"
        @click="emit('add')"
      >
        <v-icon>$mdi-plus</v-icon>
      <!--   <i18n-t
          scope="global"
          keypath="common.crud.create.title"
        >
          <template #entity>
            {{ t(`entities.${modelName}.name`) }}
          </template>
        </i18n-t> -->
      </v-btn>
    </div>
  </v-app-bar>
</template>
