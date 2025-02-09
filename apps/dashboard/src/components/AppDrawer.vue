<script lang="ts" setup>
/* import { getDrawerModels } from '@/utils/loadModelClasses'
 */
/* console.log('allIconsAliases', allIconsAliases)
const { aliases } = allIconsAliases */
const { t, availableLocales, locale } = useI18n()
const appStore = useAppStore()
const { user } = toRefs(appStore)
const router = useRouter()
function logout(): void {
  useAuth()
    .signOut()
    .then(() => {
      return router.push('/login').catch((error: unknown) => {
        console.error('logout error', error)
      })
    })
    .catch((error: unknown) => {
      console.error('logout error', error)
    })
    .finally(() => {
    /*   router.push('/login').catch((error) => {
        console.error('logout error', error)
      }) */
    })
}
/* const entities = computed(() => getDrawerModels()) */
const { global, current } = useTheme()
</script>

<template>
  <v-navigation-drawer
    color="background"
    order="3"
    permanent
    app
  >
    <v-list
      density="compact"
      nav
      slim
      class="compactor"
    >
      <v-list-item
        :subtitle="user?.email"
        :title="user?.name"
        lines="two"
      >
      <!--   <template
          v-if="preferences.drawer"
          #prepend
        >
          <v-icon
            icon="$mdi-chevron-right"
            @click="
              preferences.drawer = !preferences.drawer
            "
          />
        </template>
        <template
          v-else
          #append
        >
          <v-icon
            icon="$mdi-chevron-left"
            @click="
              preferences.drawer = !preferences.drawer
            "
          />
        </template> -->
      </v-list-item>

      <v-switch
        :model-value="current.dark"
        label="Slim"
        color="primary"
        @click="global.name.value = global.current.value.dark ? 'light' : 'dark'"
      />
      <v-list-item
        prepend-icon="$mdi-earth"
      >
        <v-select
          :model-value="locale"
          :items="availableLocales"
          label="Language"
          density="compact"
          variant="solo-filled"
          hide-details
          @update:model-value="locale = $event"
        />
      </v-list-item>
      <v-divider />

      <v-list-group expand-icon="$mdi-chevron-down" collapse-icon="$mdi-chevron-up">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            density="compact"
            slim
            nav
            class="compactor"
          >
            <v-list-subheader>
              {{ t('pages.config.navButton') }}
            </v-list-subheader>
          </v-list-item>
        </template>
        <v-list-item
          :title="t('entities.language.title')"
          prepend-icon="$mdi-translate"
          to="/config/languages"
          density="compact"
        />
        <v-list-item
          :title="t('pages.config.websiteSettings.navButton')"
          prepend-icon="$mdi-cog"
          density="compact"
          to="/config/website-settings"
        />
      </v-list-group>

      <v-list-item
        :title="t('pages.dashboard.navButton')"
        prepend-icon="$mdi-view-dashboard"
        to="/"
      />
      <v-list-item
        :title="t('entities.category.title')"
        prepend-icon="$mdi-shape"
        to="/entities/category"
      />
      <v-list-item
        :title="t('entities.article.title')"
        prepend-icon="$mdi-shape"
        to="/entities/article"
      />
      <!--  <v-list-item
        v-for="(entity, index) in entities"
        :key="`entity-${index}`"
        :title="t(`entities.${useChangeCase(entity.name, 'camelCase').value}.title`)"
        :prepend-icon="entity.icon"
        :to="`/entities/${useChangeCase(entity.name, 'kebabCase').value}`"
      /> -->
    <!--   <v-list-item
        :title="t('entities.staticContent.title')"
        prepend-icon="$mdi-file-document"
        to="/entities/static-content"
      />
      <v-list-item
        :title="t('entities.category.title')"
        prepend-icon="$mdi-shape"
        to="/entities/category"
      />
      <v-list-item
        :title="t('entities.article.title')"
        prepend-icon="$mdi-newspaper"
        to="/entities/article"
      />
      <v-list-item
        :title="t('entities.tag.title')"
        prepend-icon="$mdi-tag"
        to="/entities/tag"
      /> -->
    </v-list>

    <template #append>
      <v-list-item
        :title="t('common.actions.logout')"
        color="primary"
        prepend-icon="$mdi-logout"
        @click="logout"
      />
    </template>
  </v-navigation-drawer>
</template>
