<script setup lang="ts">
import type { Language, TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { computed } from 'vue'
import TextClamp from 'vue3-text-clamp'
import { useI18n } from 'vue-i18n'

interface Props {
  value?: TextContent
  locale?: string
  nowrap?: boolean
}

const props = defineProps<Props>()

const { languages } = useLocales()
const { t, locale } = useI18n()

const missingTranslations = computed(() => {
  return languages.value.filter(language => !props.value?.content[language.code])
})

const fallback = computed(() => {
  if (props.locale && props.value && props.value.content[props.locale]) {
    return props.value.content[props.locale]
  }
  for (const language of languages.value) {
    if (props.value && props.value.content[language.code]) {
      return props.value.content[language.code]
    }
  }
  return ''
})
</script>

<template>
  <v-tooltip
    v-if="fallback"
    location="bottom"
    content-class="bg-background-darken-1 rounded-lg"
  >
    <template #activator="{ props: tooltipProps }">
      <v-icon
        v-bind="tooltipProps"
        size="12"
        :color="missingTranslations.length > 0 ? 'error' : 'success'"
      >
        $mdi-earth
      </v-icon>
      <text-clamp
        v-tooltip="value?.messages ? value?.messages![locale] : fallback || t('common.missingTranslation')"
        auto-resize
        class="d-inline"
        :text="value?.messages ? value?.messages![locale] : fallback"
        :max-lines="nowrap ? 0 : 1"
      />
    </template>
    <v-sheet max-width="300" color="transparent">
      <v-list-item
        v-for="(language, index) in languages.sort((a:Language, b:Language) => a.code === locale ? -1 : b.code === locale ? 1 : 0)"
        :key="language.code"
        density="compact"
        class="compactor px-0"
        :class="{
          'border-b-thin': index < languages.length - 1,
        }"
      >
        <template #title>
          <span class="text-wrap">
            {{ value?.content[language.code] }}
          </span>
        </template>
        <template #prepend>
          <v-chip
            density="compact"
            class="mb-auto"
            size="small"
            :color="!value?.content[language.code] ? 'error' : 'secondary'"
          >
            <small><strong>{{ t(`common.lang.${language.code}`) }}</strong></small>
          </v-chip>
        </template>
      </v-list-item>
    </v-sheet>
  </v-tooltip>
  <!--  <text-clamp :text="value?.message ? value?.messages![locale] : fallback" :max-lines="1" /> -->
</template>
