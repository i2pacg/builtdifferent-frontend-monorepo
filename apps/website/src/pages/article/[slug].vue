<template>
  <h1>ARticle {{ route.params.slug }}</h1>
</template>

<script lang="ts" setup>
const route = useRoute('/article/[slug]')

onMounted(() => {
  console.log('mounted Article')
})
</script>
