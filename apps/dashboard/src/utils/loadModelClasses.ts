import type { EntityConfig } from '@i2pacg/builtdifferent-frontend-tsdata'
import type { Constructor } from 'pinia-orm'
import { LOG_FILES_COLOR } from '@/constants'
import { randomIcon } from '@/plugins/icons'
import { useChangeCase } from '@vueuse/integrations/useChangeCase.mjs'
import { Model } from 'pinia-orm'

const modelCache: Record<string, any> = {}

function isModelConstructor(value: any): value is Constructor<Model> {
  return typeof value === 'function' && value.prototype instanceof Model
}

export function getAvailableModelClasses(): string[] {
  const externalModelClasses = import.meta.glob('@i2pacg/builtdifferent-frontend-tsdata/models/index.ts', { eager: true })
  const allModels = Object.values(externalModelClasses)[0] as Record<string, any>

  return Object.entries(allModels)
    .filter(([_, value]) => isModelConstructor(value))
    .map(([key]) => key)
}

export function loadModelClasses(entityName: string): Constructor<Model> {
  console.log(`%c[loadModelClasses] %cLoading model for ${entityName}`, LOG_FILES_COLOR, 'color:white')
  const className = useChangeCase(entityName, 'pascalCase').value

  if (modelCache[className]) {
    console.log(`%c[loadModelClasses] %cCache %c hit`, LOG_FILES_COLOR, 'color:white', 'color: #ff00ff')
    return modelCache[className]
  }

  const externalModelClasses = import.meta.glob('@i2pacg/builtdifferent-frontend-tsdata/models/index.ts', { eager: true })
  const allModels = Object.values(externalModelClasses)[0] as Record<string, any>
  const model = allModels[className]

  if (!model || !isModelConstructor(model)) {
    throw new Error(`Valid model not found for ${className}`)
  }

  console.log(`%c[loadModelClasses] %cCache %cmiss`, LOG_FILES_COLOR, 'color:white', 'color: #ff8080;font-weight:bold')
  modelCache[className] = model
  return model as Constructor<Model>
}

export function getDrawerModels(): { name: string, icon: string }[] {
  const modelClasses = getAvailableModelClasses()
  return modelClasses.filter((modelName) => {
    try {
      const ModelClass = loadModelClasses(modelName)
      const entityConfig: EntityConfig = useRepo(ModelClass).getModel().$config()?.entityConfig || {
        relationFields: {},
        multiLocale: false,
        defaultFormFieldsConfig: {},
      } as EntityConfig
      return entityConfig.drawer || false
    }
    catch (error) {
      console.error(error)
      return false
    }
  }).map((modelName) => {
    const ModelClass = loadModelClasses(modelName)
    const entityConfig: EntityConfig = useRepo(ModelClass).getModel().$config()?.entityConfig || {
      relationFields: {},
      multiLocale: false,
      defaultFormFieldsConfig: {},
    } as EntityConfig
    return {
      name: modelName,
      icon: entityConfig.drawerIcon || randomIcon(),
    }
  })
}
