// Utilities
import type { UserConfig } from 'vite'
// Plugins
import fs from 'node:fs'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { ClientSideLayout } from 'vite-plugin-vue-layouts'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
  const env = loadEnv('dashboard.builtdifferent.dev', '../../../')
  process.env = { ...process.env, ...env }
  const isDev = mode === 'development'

  const config: UserConfig = {
    envDir: '../../..',
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    plugins: [
      VueRouter({
        dts: isDev ? false : 'src/typed-router.d.ts',
      }),
      ClientSideLayout({
        layoutDir: 'src/layouts',
      }),
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          VueRouterAutoImports,
          {
            'vuetify': ['useDisplay', 'useLocale', 'useTheme'],
            'pinia': ['defineStore'],
            'pinia-orm': ['useRepo', 'Model'],
            '@pinia-orm/axios': ['useAxiosRepo'],
          },
        ],
        dts: isDev ? false : 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: false,
        },
        dirs: isDev 
          ? ['src/composables', 'src/data']
          : ['src/interfaces', 'src/composables', './src/data', 'src/interfaces'],
        vueTemplate: true,
      }),
      Components({
        dts: isDev ? false : 'src/components.d.ts',
        dirs: ['src/components'],
        resolvers: [
          (componentName) => {
            // where `componentName` is always CapitalCase
            if (componentName.endsWith('Field'))
              return { name: componentName, from: `@/components/form/${componentName}.vue` }
          },
        ],
      }),
      Vue({
        template: {
          transformAssetUrls,
        },
        script: {
          defineModel: true,
          propsDestructure: true,
        },
      }),
      Vuetify({
        autoImport: true,
      }),
      !isDev && Icons({
        autoInstall: true,
      }),
      laravel({
        input: ['src/main.ts', 'src/assets/scss/app.scss'],
        refresh: true,
        hotFile: '../../../public/dashboard.hot', // Customize the "hot" file...
        publicDirectory: '../../../public',
        buildDirectory: 'build-dashboard',
      }),
    ].filter(Boolean),
    define: { 'process.env': process.env },
    esbuild: {
      keepNames: isDev,
      target: 'esnext',
      legalComments: 'none',
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'vuetify',
      ],
      force: false,
      exclude: isDev ? [
        '@i2pacg/builtdifferent-frontend-bdhelpers',
        '@i2pacg/builtdifferent-frontend-tsdata',
        'pinia-orm',
        '@pinia-orm/axios',
        '@tiptap/extension-placeholder',
        '@tip-tap/extension-highlight',
      ] : [],
    },
    build: {
      minify: isDev ? false : 'esbuild',
      target: 'esnext',
      sourcemap: !isDev,
      reportCompressedSize: false,
      rollupOptions: isDev ? {} : {
        output: {
          manualChunks: {
            vue: ['vue'],
            vendor: ['pinia'],
            vueUse: ['@vueuse/core'],
            router: ['vue-router/auto'],
            vuetify: ['vuetify'],
            models: ['@i2pacg/builtdifferent-frontend-tsdata/models'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
    server: {
      host: process.env.VITE_APP_DOMAIN,
      hmr: {
        overlay: false,
      },
      fs: {
        strict: true,
        allow: ['..'],
      },
    },
  }

  if (command === 'serve') {
    console.log('command', process.env.VITE_APP_DOMAIN)
    const key = await fs.promises.readFile(
      'D:/DevTools/laragon/etc/ssl/laragon.key',
    )
    const cert = await fs.promises.readFile(
      'D:/DevTools/laragon/etc/ssl/laragon.crt',
    )
    config.server = {
      host: process.env.VITE_APP_DOMAIN,
      cors: true,
      https: {
        key,
        cert,
      },
      hmr: {
        host: process.env.VITE_APP_DOMAIN,
      },
    }
  }

  return config
})
