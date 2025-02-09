<script setup lang="ts">
import { VTooltip } from 'vuetify/components'

defineProps<{
  url: string
  name: string
}>()
</script>

<template>
  <div>
    <v-tooltip
      max-height="300"
      max-width="300"
      width="300"
      content-class="pa-0"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
        >
          <v-icon color="grey-lighten-1">
            mdi-image
          </v-icon>
        </v-btn>
      </template>
      <v-card
        class="pa-0 d-flex flex-column"
        width="300"
        color="background-darken-3"
      >
        <h3 class="pa-2">
          {{ name }}
        </h3>
        <v-img
          :src="url"
          alt="image"
          contain
          height="100%"
          width="100%"
        />
      </v-card>
    </v-tooltip>
  </div>
</template>
