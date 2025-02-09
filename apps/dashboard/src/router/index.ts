/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { axiosQueue } from '@/plugins/axios'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

/**
 * Recursively applies layouts to the given route and its children.
 * @param {RouteRecordRaw} route - The route to apply layouts to.
 * @returns {RouteRecordRaw} The modified route with layouts applied.
 */

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
    else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  }
  else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

router.beforeEach(async (to, from, next) => {
  const { isUserAuthenticated } = useAuth()
  if (!(await isUserAuthenticated()) && to.name !== 'login') {
    next({
      name: 'login',
      query: { nextUrl: to.fullPath },
    })
  }
  else {
    next()
  }
})

export default router
