<script setup lang="ts">
defineProps<{
  value: number
}>()

onMounted(() => {})
</script>

<template>
  <span>{{ value }}</span>
</template>
