<script lang="ts" setup>
const banner = import.meta.env.VITE_APP_BANNER
</script>

<template>
  <v-app-bar
    id="app-nav"
    :elevation="2"
    :extension-height="48"
    :height="420"
    color="black"
    absolute
  >
    <template #image>
      <v-img
        :src="banner"
        alt="Military Watch Magazine Banner"
        title="Military Watch Magazine Banner"
        position="center"
        :height="420"
        width="100%"
        class="ml-auto"
        eager
        cover
      />
    </template>
    <!--     <v-app-bar-title>
      <v-img
        :src="logoWText"
        alt="military watch magazine logo"
        title="military watch magazine logo"
        contain
        height="250"
        width="50%"
        eager
        :transition="false"
      />
    </v-app-bar-title> -->
    <template #extension>
      <v-card
        height="100%"
        width="100%"
        class="position-sticky top-0 d-flex align-center"
      >
        <v-btn
          color="primary"
          href="https://forceindex.v1-5.mwm.com/"
          variant="flat"
          class="font-weight-bold"
          style="
            letter-spacing: 4px;
            font-size: 16px;
          "
        >
          Force Index
        </v-btn>
        <v-spacer />
        <v-btn
          to="/"
          variant="flat"
          text="Home"
          size="small"
        />
        <v-btn
          href="https://v1-5.mwm.com/feeds/headlines"
          variant="flat"
          text="RSS"
          size="small"
          prepend-icon="mdi-rss"
        />
        <v-btn
          :to="{
            name: '/article/[slug]',
            params: {
              slug: 'articleTest',
            },
          }"
          variant="flat"
          text="article"
          size="small"
        />
        <!--     <v-menu
          v-for="section in sections"
          :key="section.id"
          variant="flat"
          :text="section.section_name"
          size="small"
          :content-props="{
            maxWidth: 200,
          }"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="flat"
              :text="section.section_name"
              size="small"
              class="px-1"
            />
          </template>
          <v-list
            slim
            density="compact"
          >
            <v-list-item
              v-for="category in section.categories"
              :key="category.id"
              :title="category.category_name"
              class="text-sm text-uppercase"
            >

        </v-list-item>
        </v-list>
        </v-menu> -->
      </v-card>
    </template>
  </v-app-bar>
</template>
