<script setup lang="ts">
defineProps<{
  label: string
}>()
const model = defineModel<Date | null>()
const { t } = useI18n()
const { current } = useTheme()
</script>

<template>
  <vue-date-picker
    v-model="model"
    :teleport="true"
    :dark="current.dark"
    placeholder="Select date"
    position="left"
    :clearable="false"
  >
    <template
      #dp-input="{
        value, onInput, onEnter, onTab, onClear, onBlur, onKeypress, onPaste,
      }"
    >
      <v-text-field
        :model-value="value"
        :label="t(label)"
        :dense="true"
        variant="outlined"
        :menu-props="{ zIndex: 3001 }"
        density="compact"
        tile
        hide-details
        @input="onInput"
        @keydown.enter="onEnter"
        @keydown.tab="onTab"
        @keydown.esc="onClear"
        @blur="onBlur"
        @keypress="onKeypress"
        @paste="onPaste"
      />
    </template>
  </vue-date-picker>
</template>
