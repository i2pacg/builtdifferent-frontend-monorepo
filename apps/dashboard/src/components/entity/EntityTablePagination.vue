<script setup lang="ts">
defineProps<{
  pages: number
  page: number
  itemsPerPage: number
}>()
const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:itemsPerPage', itemsPerPage: number): void
}>()
const { t } = useI18n()

const itemsPerPageOptions = [10, 25, 50, 100]
</script>

<template>
  <v-sheet class="d-flex flex-wrap pa-2 gap-4" color="background">
    <!-- Items Per Page -->
    <v-select
      :model-value="itemsPerPage"
      :items="itemsPerPageOptions"
      :label="t('$vuetify.dataFooter.itemsPerPageText')"
      density="compact"
      hide-details
      @update:model-value="emit('update:itemsPerPage', $event)"
    />

    <!-- Pagination -->
    <v-spacer />
    <small class="my-auto">
      {{ t('$vuetify.dataFooter.pageText', [(page - 1) * itemsPerPage + 1, pages, pages * itemsPerPage]) }}
    </small>
    <responsive-pagination
      :page="page"
      :pages="pages"
      @update="emit('update:page', $event)"
    />
  </v-sheet>
</template>
