import type { PiniaPlugin } from 'pinia'
// Utilities
import axios from '@/plugins/axios'
import { createPiniaOrmAxios } from '@pinia-orm/axios'
import { createPinia } from 'pinia'
import { createORM } from 'pinia-orm'

const piniaOrm: PiniaPlugin = createORM()
// @ts-expect-error PiniaPlugin is not typed
piniaOrm().use(createPiniaOrmAxios({
  axios,
  baseURL: '/api',
}))
const pinia = createPinia().use(piniaOrm)
export default pinia
