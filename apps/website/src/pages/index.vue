<script lang="ts" setup>
import { Category } from '@/data/models/category.model'
import { useRepo } from 'pinia-orm'
import { Swiper, SwiperSlide } from 'swiper/vue'
import TextClamp from 'vue3-text-clamp'
import 'swiper/css'

/* const { articles: latestArticles, requests } = useArticleListing({ properties: { article_featured: true }, page: 1, itemsPerPage: 6 })
 */
const loaded = ref(false)
function onSlideChange() {
  console.log('slide change')
}

function onSwiper(swiper: any) {
  console.log('swiper', swiper)
}
const categories = useRepo(Category).all()
/* watch(latestArticles, () => {
  if (latestArticles.value.length > 0) {
    loaded.value = true
  }
}) */
/* const { articles: latestArticles, requests } = useArticleListing({ properties: { article_featured: true }, page: 1, itemsPerPage: 6 }) */
onMounted(() => {
  console.log('mounted Home')
})
</script>

<template>
  <swiper
    :slides-per-view="1"
    :space-between="0"
    :height="410"
    @swiper="onSwiper"
    @slide-change="onSlideChange"
  >
    <!--     <swiper-slide
      v-for="x in 6"
      :key="`${x}_article`"
    >
      <v-card
        width="100%"
        height="410"
        color="black"
      >
        <v-row no-gutters>
          <v-col
            order="1"
            cols="6"
            class="d-flex"
            align-self="stretch"
          >
            <div class="d-flex flex-column pa-2">
              <v-skeleton-loader
                v-if="!latestArticles[x] || !latestArticles[x].article_title"
                type="list-item-three-line"
                color="black"
              />
              <h1
                v-else
                class="article-title"
              >
                {{ latestArticles[x].article_title }}
              </h1>
              <v-skeleton-loader
                v-if="!latestArticles[x] || !latestArticles[x].categories"
                type="list-item"
                color="black"
              />
              <h2
                v-else
                class="article-categories text-subtitle-2 font-weight-bold"
              >
                <span v-text="latestArticles[x].categories.map(c => c.category_name).join(', ')" />
              </h2>
              <div class="article-date">
                <v-skeleton-loader
                  v-if="!latestArticles[x]"
                  type="text"
                  color="black"
                  width="150px"
                />
                <small v-else>
                  <time
                    :datetime="latestArticles[x].date"
                    pubdate
                    class="text-sm text-primary font-weight-bold"
                    v-text="latestArticles[x].date"
                  />
                </small>
              </div>
              <v-skeleton-loader
                v-if="!latestArticles[x]"
                type="text@3"
                color="black"
                class="my-auto"
              />
              <text-clamp
                v-else
                :max-lines="3"
                :text="latestArticles[x].article_snippet"
                class="my-auto"
              />

              <div class="d-flex justify-space-between align-center">
                <v-skeleton-loader
                  v-if="!latestArticles[x]"
                  type="avatar@3"
                  color="black"
                />
                <share-buttons
                  v-else
                  :url="latestArticles[x].link"
                  :title="latestArticles[x].article_title"
                  :description="latestArticles[x].article_snippet"
                />
                <v-skeleton-loader
                  v-if="!latestArticles[x]"
                  height="36px"
                  type="button"
                />

                <v-btn
                  v-else
                  color="white"
                  class="my-auto"
                  light
                  :to="{
                    name: '/article/[slug]',
                    params: {
                      slug: latestArticles[x].article_identifier,
                    },
                  }"
                >
                  <span>Continue Reading.</span>
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col
            no-gutters
            order="2"
            cols="6"
          >
            <v-img
              v-if="latestArticles[x]"
              :src="latestArticles[x].article_cover"
              :height="410"
              :transition="false"
            />
            <v-skeleton-loader
              v-else
              type="image"
              :height="410"
            />
          </v-col>
        </v-row>
      </v-card>
    </swiper-slide> -->
  </swiper>
  <v-row v-if="loaded">
    <!--  <v-col cols="12">
      <pre>{{ JSON.stringify(requests, null, 2) }}</pre>
    </v-col> -->
    <v-col cols="9">
      <v-col
        v-for="category in categories"
        :key="category.id"
      >
        <v-card>
          {{ category.name }}
        </v-card>
        <v-row no-gutters>
          <v-col
            v-for="subCategory in category.subCategories"
            :key="subCategory.id"
            cols="4"
          >
            <v-list>
              {{ subCategory.name }}
            </v-list>
            <!--   <article-listing :params="{ properties: { category: subCategory.id }, page: 1, itemsPerPage: 6 }" /> -->
          </v-col>
        </v-row>
      </v-col>
    </v-col>
    <v-col cols="3">
      <v-card>
        <v-card-title>
          Editor's Choice
        </v-card-title>
        <v-card-text>
          <!--  <article-listing :params="{ properties: { article_e_choice: true }, page: 2, itemsPerPage: 4 }" /> -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
