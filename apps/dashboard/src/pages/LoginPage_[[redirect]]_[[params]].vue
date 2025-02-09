<script lang="ts" setup>
import type { AxiosError } from 'axios'
import type { Router, RouteRecordNormalized } from 'vue-router'
import useAuth from '@/composables/useAuth'

const props = defineProps<{
  isModal?: boolean
  redirect?: string
  params?: string
}>()

const { t } = useI18n()
/* <LocalizedMessages> */
const loading = ref(false)
const fromRef = ref()
const router: Router = useRouter()
const form = reactive({
  valid: false,
  email: 'i2pacg@gmail.com',
  password: '12345678',
  showPassword: false,
})
const params = computed<Record<string, string>>(() => {
  if (!props.params)
    return {}
  return props.params.split('&').reduce((acc: Record<string, string>, param) => {
    const [key, value] = param.split('=')
    if (key !== 'subdomain') {
      acc[key] = value
    }
    return acc
  }, {})
})
const errorMessage = ref('')
const emailRules = ref([
  (value: unknown): string | boolean => {
    if (value != null && value !== '')
      return true
    return 'E-mail is required.'
  },
  (value: string): string | boolean => {
    if (/.[^\n\r@\u2028\u2029]*@.+\..+/.test(value))
      return true
    return 'E-mail must be valid.'
  },
])
const passwordRules = ref([
  (value: unknown): string | boolean => {
    if (value != null && value !== '')
      return true
    return 'Password is required.'
  },
  (value: string | unknown[]): string | boolean => {
    if (value?.length >= 6)
      return true

    return 'Password must be at least 6 characters.'
  },
])

const isError = computed({
  get() {
    return errorMessage.value !== ''
  },
  set(newValue) {
    if (!newValue)
      errorMessage.value = ''
  },
})

function signIn(): void {
  if (loading.value)
    return

  if (!form.valid)
    return
  loading.value = true
  useAuth()
    .signIn({ email: form.email, password: form.password })
    .then((success: boolean) => {
      if (!success) {
        errorMessage.value = 'Invalid credentials'
        return
      }
      /* log({
        source: 'LoginPage',
        message: 'SignIn Success',
      }) */
      if (props.redirect && router.hasRoute(props.redirect)) {
        const redirectRoute = router.getRoutes().find((route: RouteRecordNormalized) => route.name === props.redirect)
        /*  log({
          source: 'LoginPage',
          message: 'SignIn redirectRoute',
          data: redirectRoute,
        }) */
        if (redirectRoute) {
          return router.push(replacePathParams(redirectRoute!.path, params.value))
        }
      }
      return router.push('/')
    })
    .catch((error: AxiosError) => {
      /*  log({
        source: 'LoginPage',
        message: 'SignIn error',
        error,
      }) */
      errorMessage.value = error.message
    })
    .finally(() => {
      loading.value = false
    })
}
function replacePathParams(path: string, params: Record<string, string>): string {
  return path.replace(/:\w+/g, (match) => {
    const key = match.substring(1)
    return params[key] ?? match
  })
}/*
function signInWithXSRFToken(): void {
  console.log('::signInWithXSRFToken')
  axiosInstance.get('/sanctum/csrf-cookie').then((response: unknown) => {
    console.log('::signInWithXSRFToken response', response)
    // Login...
    useAuth()
      .signIn({ email: form.email, password: form.password })
      .then((success: boolean) => {
        console.log('::SignIn Success', success)
      })
  })
}
 */
const appTitle = import.meta.env.VITE_APP_TITLE
const appLogo = import.meta.env.VITE_APP_LOGO

onMounted(() => {
})
</script>

<template>
  <v-card
    class="bg-background-darken-4 pa-3 ma-auto"
    width="500"
    variant="tonal"
    :loading="loading"
  >
    <template #title>
      <v-list-item>
        <v-list-item-title>
          {{ appTitle }}
        </v-list-item-title>
        <template #append>
          <v-img
            :src="appLogo"
            width="32"
          />
        </template>
      </v-list-item>
    </template>
    <v-form
      ref="fromRef"
      v-model="form.valid"
      :disabled="loading"
    >
      <v-card-item>
        <v-row no-gutters>
          <v-col
            class="pa-2"
            cols="12"
          >
            <v-text-field
              v-model="form.email"
              :label="t('pages.login.form.email.label')"
              :rules="emailRules"
              autocomplete="username"
              prepend-icon="$mdi-account"
              type="email"
              color="secondary"
              variant="solo-filled"
              hide-details
              required
            />
          </v-col>
          <v-col
            class="pa-2"
            cols="12"
          >
            <v-text-field
              v-model="form.password"
              :append-inner-icon="`$mdi-eye${form.showPassword ? '-off' : ''}`"
              :on-click:append-inner="() => (form.showPassword = !form.showPassword)"
              :label="t('pages.login.form.password.label')"
              :rules="passwordRules"
              :type="form.showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              prepend-icon="$mdi-key"
              color="secondary"
              variant="solo-filled"
              hide-details
              required
            />
          </v-col>
        </v-row>
      </v-card-item>
      <v-alert
        v-model="isError"
        :text="errorMessage"
        title="Error"
        type="error"
        closable
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!form.valid"
          variant="tonal"
          :text="t('pages.login.form.buttons.login')"
          @click="signIn"
        />
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<route lang="json">
  {
      "$schema": "https://raw.githubusercontent.com/posva/unplugin-vue-router/main/route.schema.json",
      "path": "/login/:redirect?/:params?",
      "name": "login",
      "meta": {
        "permissions": [],
        "layout": "default"
      },
      "props": true
  }
</route>
