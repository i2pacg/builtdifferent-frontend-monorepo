<script lang="ts" setup>
</script>

<template>
  <v-main class="d-flex fill-height">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </v-main>
</template>
