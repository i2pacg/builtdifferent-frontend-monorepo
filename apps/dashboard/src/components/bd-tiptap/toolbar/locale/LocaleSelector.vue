<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
  singleLine?: boolean
}>()
const { t, availableLocales } = useI18n()

const currentLocale = computed(() => props.editor.storage.localeManager.currentLocale)

// Create items with translation status from extension storage

interface LocaleItem {
  value: string
  title: string
  hasTranslation: boolean
}
const localeItems = computed<LocaleItem[]>(() =>
  availableLocales.map(locale => ({
    value: locale,
    title: t(`common.lang.${locale}`),
    hasTranslation: props.editor.storage.localeManager.translationStatus[locale]?.hasContent ?? false,
  })),
)

/* function startTranslation() {
  props.editor.commands.startTranslating()
  // Implement your translation logic here
} */
</script>

<template>
  <v-select
    :model-value="currentLocale"
    :items="localeItems"
    density="compact"
    hide-details
    class="compactor flex-grow-0"
    variant="outlined"
    :item-props="(item) => ({
      title: t(`common.lang.${item.value}`),
    })"
    :list-props="{
      density: 'compact',
      bgColor: 'background darken-2',
      class: 'compactor',
    }"
    :menu-props="{
      class: 'pa-0',
    }"
    min-width="150"
    tile
    focused
    @click.stop
    @update:model-value="editor.commands.setLocale($event)"
  >
    <template #prepend-inner>
      <v-icon size="14">
        $fluent-mdl2-locale-language
      </v-icon>
    </template>
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <template #append>
          <v-badge
            :color="item.raw.hasTranslation ? 'success' : 'error'"
            dot
            size="small"
          />
        </template>
      </v-list-item>
    </template>
  </v-select>
  <v-menu>
    <template #activator="{ props: activatorProps }">
      <v-btn
        :disabled="!localeItems.filter(item => item.value !== currentLocale).some(item => item.hasTranslation)"
        :height="24"
        variant="tonal"
        size="x-small"
        v-bind="activatorProps"
      >
        translate
      </v-btn>
    </template>
    <small class="caption">

      {{ t('common.lang.translateFrom') }}

    </small>
    <v-list
      density="compact"
      class="compactor"
      :items="localeItems.filter(item => item.value !== currentLocale && item.hasTranslation)"
      :item-props="(item) => ({
        onclick: () => editor.commands.translate(currentLocale, item.value),
      })"
    />
  </v-menu>
</template>
