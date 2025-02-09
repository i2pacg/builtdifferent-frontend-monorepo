<script setup lang="ts">
import type { TextType } from '@i2pacg/builtdifferent-frontend-tsdata'
import { LOG_COMPONENTS_COLOR } from '@/constants'

import { TextContent } from '@i2pacg/builtdifferent-frontend-tsdata/models'
import { VTextarea } from 'vuetify/components/VTextarea'
import { VTextField } from 'vuetify/components/VTextField'

const props = withDefaults(defineProps<{
  textType?: TextType
  locales?: string[]
  label?: string
}>(), {
  textType: 'short_text',
})
const model = defineModel<TextContent>({
  get(v): TextContent {
    if (v instanceof TextContent) {
      return v
    }
    return new TextContent({
      type: props.textType,
    })
  },
})

const fieldComponent = computed(() => props.textType === 'long_text' ? VTextarea : VTextField)
onMounted(() => {
  console.log(`%c[TextContentField] %c[onMounted] type %c${props.textType}`, LOG_COMPONENTS_COLOR, 'color:white', 'color:lightblue', model.value)
})

const { getByCode } = useLocales()
</script>

<template>
  <bd-tip-tap
    v-if="textType === 'html'"
    v-model="model!"
    default-locale="en"
    :supported-locales="locales"
  />
  <template v-else>
    <v-locale-provider
      v-for="locale in locales"
      :key="locale"
      :locale="locale"
      :direction="getByCode(locale!)?.direction"
    >
      <component
        :is="fieldComponent"
        v-model="model!.content[locale!]"
        density="compact"
        variant="outlined"
        hide-details
        tile
        clearable
      >
        <template #label>
          <i18n-t
            :keypath="label!"
            scope="global"
            tag="small"
            :locale="locale"
          />
          <i18n-t
            v-if="locales!.length > 1"
            :keypath="`common.locale.${locale}`"
            scope="global"
            tag="small"
            :locale="locale"
            class="ms-1"
            style="font-size: 8px;"
          />
        </template>
      </component>
    </v-locale-provider>
  </template>
</template>
