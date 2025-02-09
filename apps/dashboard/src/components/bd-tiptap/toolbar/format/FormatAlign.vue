<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

import { useI18n } from 'vue-i18n'
import { VBtnToggle } from 'vuetify/components'

defineProps<{
  editor: Editor
}>()

const { t } = useI18n()
</script>

<!-- :model-value="elementFormat"
 -->
<template>
  <v-btn-toggle
    density="compact"
    :height="24"
    size="x-small"
    variant="text"
    tile
    hide-details
    color="primary"
    class="compactor"
  >
    <v-btn
      :aria-label="t('bdTipTap.toolbar.alignStart')"
      :title="t('bdTipTap.toolbar.alignStart')"
      :height="24"
      size="x-small"
      tile
      value="left"
      :active="editor.isActive('left')"
      @click="() => editor.chain().focus().setTextAlign('left').run()"
    >
      <v-icon
        icon="$mdi-format-align-left"
        :size="20"
      />
    </v-btn>
    <v-btn
      :aria-label="t('bdTipTap.toolbar.alignCenter')"
      :title="t('bdTipTap.toolbar.alignCenter')"
      :height="24"
      size="x-small"
      tile
      value="center"
      :active="editor.isActive('center')"
      @click="() => editor.chain().focus().setTextAlign('center').run()"
    >
      <v-icon
        icon="$mdi-format-align-center"
        :size="20"
      />
    </v-btn>

    <v-btn
      :aria-label="t('bdTipTap.toolbar.alignEnd')"
      :title="t('bdTipTap.toolbar.alignEnd')"
      :height="24"
      size="x-small"
      value="right"
      :active="editor.isActive('right')"
      @click="() => editor.chain().focus().setTextAlign('right').run()"
    >
      <v-icon
        icon="$mdi-format-align-right"
        :size="20"
      />
    </v-btn>
    <v-btn
      :aria-label="t('bdTipTap.toolbar.alignJustify')"
      :title="t('bdTipTap.toolbar.alignJustify')"
      :height="24"
      size="x-small"
      value="justify"
      @click="() => editor.chain().focus().setTextAlign('justify').run()"
    >
      <v-icon
        icon="$mdi-format-align-justify"
        :size="20"
      />
    </v-btn>
    <!--

    <v-menu
      :close-on-content-click="false"
      location="bottom end"
      width="225"
      :persistent="pinSpacing"
    >
      <template #activator="{ props: menu }">
        <v-btn
          :aria-label="t('bdTipTap.toolbar.lineHeight')"
          :title="t('bdTipTap.toolbar.lineHeight')"
          :height="32"
          variant="text"
          size="x-small"
          tile
          v-bind="menu"
        >
          <i-tabler-line-height font-size="18px" />
        </v-btn>
      </template>
      <v-card
        color="surface-darken-1"
        class="pt-2"
      >
        <v-btn
          variant="text"
          size="xx-small"
          tile
          :style="{
            position: 'absolute',
            top: '8px',
            right: '8px',
          }"
          @click="pinSpacing = !pinSpacing"
        >
          <i-mdi-pin
            v-if="pinSpacing"
            font-size="16px"
          />
          <i-mdi-pin-outline
            v-else
            font-size="16px"
          />
        </v-btn>
        <bd-number-input
          :model-value="lineHeight"

          :label="t('bdTipTap.toolbar.lineHeight')"
          label-on-top
          suffix="px"
          @update:model-value="(value) => {
            console.log('update:model-value', value)
            editor.update(() => {
              const selection = $getSelection()
              console.log('selection', selection)
              if (selection !== null) {
                $patchStyleText(selection, {
                  ['line-height']: value.toFixed(2).toString(),
                })
              }
            })
          }"
        />

        <v-divider
          class="my-1"
          color="transparent"
        />
        <bd-number-input
          :model-value="letterSpacing"
          :label="t('bdTipTap.toolbar.letterSpacing')"
          label-on-top
          suffix="px"
          @update:model-value="(value) => {
            console.log('update:model-value', value)
            editor.update(() => {
              const selection = $getSelection()
              console.log('selection', selection)
              if (selection !== null) {
                $patchStyleText(selection, {
                  ['letter-spacing']: `${value.toFixed(2).toString()}px`,
                })
              }
            })
          }"
        />
        <v-text-field
          ref="letterSpacingInputRef"
        /> -->
    <!--
        <v-number-input
          ref="letterSpacingInputRef"
          :reverse="false"
          :model-value="letterSpacing"
          class="ma-2 text-center"
          density="compact"
          variant="outlined"
          hide-details
          label="Letter Spacing"
          :hide-input="false"
          :inset="false"
          :step="0.05"
          suffix="px"
          :autofocus="false"
          @update:model-value="(value) => {
            console.log('update:model-value', value)
            editor.update(() => {
              const selection = $getSelection()
              if (selection !== null) {
                $patchStyleText(selection, {
                  ['letter-spacing']: `${value.toFixed(2).toString()}px`,
                })
              }
            })
          }"
        >
          <template #increment="{ click }">
            <v-btn
              icon
              :ripple="false"
              @click="click"
            >
              <i-mdi-plus />
            </v-btn>
          </template>
          <template #decrement="{ click }">
            <v-btn
              icon
              @click="click"
            >
              <i-mdi-minus />
            </v-btn>
          </template>
        </v-number-input> -->
    <!-- <v-text-field
          density="compact"
          :model-value="lineHeight"
          class="ma-2"
          variant="outlined"
          type="number"
          hide-details
          @keydown.enter="(e) => {
            console.log('Enter', e.target, e.target.value)
            editor.update(() => {
              const selection = $getSelection()
              if (selection !== null) {
                $patchStyleText(selection, {
                  ['line-height']: `${e.target.value}`,
                })
              }
            })
          }"
        /> -->
    <!--
        <v-list
          :items="[1.0, 1.15, 1.5, 2.0, 2.5, 3.0].map(i => {
            return { value: i, title: i };
          })"
          :model-value="lineHeight"
          selectable
          bg-color="background darken-4"
          density="compact"
          class="py-0"
          item-title="title"
          item-value="value"
          color="primary"
          @click:select="({ id }) => editor.update(() => {
            const selection = $getSelection()
            if (selection !== null) {
              $patchStyleText(selection, {
                ['line-height']: id as string,
              })
            }
          })"
        />   -->   <!--  :items="[1.0, 1.15, 1.5, 2.0, 2.5, 3.0].map(i => {
            return { value: i, title: i };
          })"  <template #item="{ props }">
            <v-list-item
              v-bind="props"
              min-width="150px"
            >
              <template #append>
                <i-mdi-check
                  :color="props.value === lineHeight ? 'green' : 'transparent'"
                  font-size="18px"
                  class="me-2"
                />
              </template>
            </v-list-item>
          </template>
    </v-card>
    </v-menu> -->
  </v-btn-toggle>
</template>
