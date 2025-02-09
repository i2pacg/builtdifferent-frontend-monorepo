<!-- eslint-disable unused-imports/no-unused-vars -->
<script lang="ts" setup>
// Types
import type { PagingResponse } from '@/interfaces'
import type { FormDataType } from '@/interfaces/crud'
import type { Response } from '@pinia-orm/axios'
import type { AxiosResponse } from 'axios'
import type { Element } from 'pinia-orm'

// Components
import BdFields from '@/components/form/BdFields.vue'
// Models
import { Article, Category, TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'

import { useModal, useModalSlot, VueFinalModal } from 'vue-final-modal'

// Testing state
const newItem = ref()
const article = ref()

// Test methods for BD Fields
function loadc() {
  useAxiosRepo(Category).api().get(`/api/entities/category/technology`, {
    params: {
      page: 1,
      itemsPerPage: 1,
      with: ['articles', 'subCategories', 'parent'],
    },
    save: true,
    dataTransformer: (response: AxiosResponse<ApiResponse<Element>>) => {
      return response.data.result
    },
  }).catch((error) => {
    console.error('%c[EntityListView] [fetchItems] Error:', 'color: lightcoral;', error)
  }).finally(() => {
    newItem.value = useRepo(Category)
      .where('slug', 'technology')
      .with('locales')
      .with('subCategories')
      .with('parent')
      .with('articles')
      .first()
  })
}

/* function newc() {
  console.log('newc', Category.newRawInstance())
  newItem.value = useRepo(Category).new(false)
} */

function submit(form: FormDataType) {
  useAxiosRepo(Category).api().put(`/api/entities/category/technology`, form, {
    save: true,
    dataKey: 'result',
  }).then((response: Response) => {
    console.log('response', response)
  }).catch((error) => {
    console.error('[EntityListView] [fetchItems] Error:', error)
  })
}

/* function create(form: FormDataType) {
  useAxiosRepo(Category).api().post(`/api/entities/category`, form).then((response: Response) => {
    console.log('response', response)
  }).catch((error) => {
    console.error('[EntityListView] [fetchItems] Error:', error)
  })
} */

// Modal test
function newwitmodal() {
  const { open } = useModal({
    component: VueFinalModal,
    attrs: {
      background: 'non-interactive',
      class: 'd-flex justify-center align-center',
      contentClass: 'bg-surface m-h-75 overflow-y-auto w-66',
      clickToClose: true,
    },
    slots: {
      'swipe-banner': () => h('div', 'Swipe me'),
      'default': useModalSlot({
        component: BdFields,
        attrs: {
          model: Category,
          isModal: true,
        },
      }),
    },
  })
  open()
}
const itemsGrouped = computed(() => useRepo(Category).query().whereNull('parentId').with('subCategories').get())
const model = Category
const articleModel = Article
// Load test article
onMounted(() => {
  /* loadc() */
  useAxiosRepo(Article).api().get(`/api/entities/article/how-russias-new-zircon-hypersonic-missile-will-affect-east-asian-power-balance`, {
    params: {
      page: 1,
      itemsPerPage: 1,
      with: ['categories', 'tags'],
    },
    save: true,
    dataTransformer: (response: AxiosResponse<ApiResponse<Element>>) => {
      return response.data.result
    },
  }).catch((error) => {
    console.error('%c[EntityListView] [fetchItems] Error:', 'color: lightcoral;', error)
  }).finally(() => {
    article.value = useRepo(Article)
      .where('slug', 'how-russias-new-zircon-hypersonic-missile-will-affect-east-asian-power-balance')
      .with('locales')
      .with('categories')
      .with('tags')
      .first()
  })
/*
  useAxiosRepo(Category).api().get(`/api/entities/categories`, {
    params: {
    },
    save: true,
    dataTransformer: (response: AxiosResponse<ApiResponse<Element>>) => {
      return response.data.result
    },
  }).catch((error) => {
    console.error('%c[EntityListView] [fetchItems] Error:', 'color: lightcoral;', error)
  }).finally(() => {
    console.log('useRepo(Category)', useRepo(Category).query().whereNull('parentId').with('subCategories').get())
    useRepo(Category).hydratedDataCache.clear()

  }) */
})

const selec = ref()
</script>

<template>
  <h1>Dashboard</h1>
  <v-btn @click="loadc">
    Load Category
  </v-btn>
  <pre>
  {{ selec }}
</pre>
  <!--   <v-select
    v-if="itemsGrouped"
    v-model="selec"
    :items="itemsGrouped.map((item) => {
      return {
        id: item.id,
        name: item.name.toString(),
        subCategories: item.subCategories ? item.subCategories.map((sub) => {
          return {
            id: sub.id,
            name: sub.name,
          }
        }) : [],
      }
    })"
    item-children="subCategories"
    item-title="name"
    item-value="id"
    :multiple="false"
  >
    <template #item="{ item, props }">
      <v-list lines="one" select-strategy="classic">
        <v-list-subheader>{{ item.raw.name.toString() }}</v-list-subheader>
        <v-list-item
          v-for="(subItem, index) in item.raw.subCategories"
          :key="index"
          @click="selec = subItem.id"
        >
          <v-list-item-title>{{ subItem.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-select> -->
  <!-- Test Article Fields -->
  <v-card width="90%" class="mx-auto px-4">
    <bd-fields
      v-if="article"
      :model="articleModel"
      :item="article"
      @confirm="submit"
    />
  </v-card>

  <!-- Test Category Fields -->
<!--   <v-card width="90%" class="mx-auto px-4">
    <bd-fields
      v-if="newItem"
      :model="model"
      :item="newItem"
      @confirm="submit"
    />
  </v-card> -->

  <v-btn @click="newwitmodal">
    add with modal
  </v-btn>
</template>

<route lang="json">
{
  "$schema": "https://raw.githubusercontent.com/posva/unplugin-vue-router/main/route.schema.json",
  "name": "dashboard",
  "meta": {
    "permissions": [],
    "layout": "admin"
  }
}
</route>
