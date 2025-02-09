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
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv } from 'vite'
import Layouts from 'vite-plugin-vue-layouts'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
  const env = loadEnv('built-different.dev', '../../../env')
  console.log(env)
  console.log('Mode', mode)
  console.log('Command', command)
  console.log(process.env.VITE_APP_DOMAIN)
  process.env = { ...process.env, ...env }
  const config: UserConfig = {
    envDir: '../../../env',
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
    plugins: [
      VueRouter({
        dts: 'src/typed-router.d.ts',
      }),
      laravel({
        input: ['src/main.ts', 'src/assets/scss/app.scss'],
        refresh: true,
        hotFile: '../../../public/hot', // Customize the "hot" file...
        publicDirectory: '../../../public',
        buildDirectory: 'build',

      }),
      Layouts(),
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          {
            'vue-router/auto': ['useRoute', 'useRouter'],
            'vuetify': ['useDisplay', 'useLocale', 'useTheme'],
          },
        ],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
        },
        dirs: ['src/interfaces', 'src/composables', './src/stores', 'src/interfaces', 'src/models'],
        vueTemplate: true,
      }),
      Components({
        dts: 'src/components.d.ts',
      }),
      Vue({
        template: { transformAssetUrls },
      }),
      Vuetify({
        autoImport: true,
        /* styles: {
          configFile: 'src/styles/settings.scss',
        }, */
      }),
      Icons({
        autoInstall: true,
      }),

    ],
    define: { 'process.env': process.env },
    build: {
      sourcemap: true,
      // Minify option
      // https://vitejs.dev/config/build-options.html#build-minify
      minify: 'esbuild',
      // Rollup Options
      // https://vitejs.dev/config/build-options.html#build-rollupoptions
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue'],
            vendor: ['pinia'],
            vueUse: ['@vueuse/core'],
            router: ['vue-router/auto'],
            vuetify: ['vuetify'],
            swiper: ['swiper'],
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
    },
  }

  if (command === 'serve') {
    /*    const key = await fs.promises.readFile(
      'D:/DevTools/xampp/apache/crt/mwm.com/server.key',
    )
    const cert = await fs.promises.readFile(
      'D:/DevTools/xampp/apache/crt/mwm.com/server.crt',
    ) */
    const key = await fs.promises.readFile(
      'D:/DevTools/laragon/etc/ssl/laragon.key',
    )
    const cert = await fs.promises.readFile(
      'D:/DevTools/laragon/etc/ssl/laragon.crt',
    )
    config.server = {
      host: process.env.VITE_APP_DOMAIN,
      https: {
        key,
        cert,
      },
    }
  }

  return config
})
