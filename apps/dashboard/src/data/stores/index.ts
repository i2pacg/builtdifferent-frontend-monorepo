// Utilities
import axios from '@/plugins/axios'
import { createPiniaOrmAxios } from '@pinia-orm/axios'
import { createPinia } from 'pinia'
import { createORM, definePiniaOrmPlugin } from 'pinia-orm'

const piniaOrmEntitiesHelperPlugin = definePiniaOrmPlugin((context) => {
  context.config.apiConfig = 'test'
  return context
})
const piniaOrm = createORM({
  model: {

  },
  plugins: [
    createPiniaOrmAxios({ axios }),
    piniaOrmEntitiesHelperPlugin,
  ],
})
const pinia = createPinia().use(piniaOrm)

export default pinia

/* export { default as useCrudRuntimeWhat } from './crudRuntime' */
