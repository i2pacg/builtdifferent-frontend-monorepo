<script setup>
defineProps({
  link: { type: String, default: '/' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})
/* const { smAndDown } = useDisplay() */
</script>

<template>
  <div class="d-flex">
    <!--  <share-network
      network="facebook"
      tag="span"
      :url="link"
      :title="title"
      :description="description"
    >
      <v-btn
        icon
        color="facebook"
        variant="text"
        :size="!smAndDown ? 'large' : 'x-large'"
      >
        <v-icon icon="$mdi-facebook" />
      </v-btn>
    </share-network>
    <share-network
      network="twitter"
      tag="span"
      :url="link"
      :title="title"
      :description="description"
    >
      <v-btn
        icon
        color="twitter"
        variant="text"
        :size="!smAndDown ? 'large' : 'x-large'"
      >
        <v-icon icon="$mdi-twitter" />
      </v-btn>
    </share-network>
    <share-network
      network="whatsapp"
      tag="span"
      :url="link"
      :title="title"
      :description="description"
    >
      <v-btn
        icon
        color="whatsapp"
        variant="text"
        :size="!smAndDown ? 'large' : 'x-large'"
      >
        <v-icon icon="$mdi-whatsapp" />
      </v-btn>
    </share-network> -->
  </div>
</template>
