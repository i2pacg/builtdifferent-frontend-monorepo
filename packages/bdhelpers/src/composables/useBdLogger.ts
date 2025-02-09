const LOG_VIEWS_COLOR = 'color:rgb(222, 154, 135); font-weight:bold;font-size:14px'
const LOG_LOADER_COLOR = 'color:rgb(138, 138, 89); font-weight:bold;font-size:14px'
const LOG_FILES_COLOR = 'color: #deb887;font-weight:bolder;font-size:15px'
const LOG_COMPOSABLES_COLOR = 'color: #ff4500;font-weight:bolder;font-size:15px'
const LOG_HOOK_COLOR = 'color: #9370db;font-weight:bolder;font-size:15px'
const LOG_COMPONENTS_COLOR = 'color:rgb(154, 222, 135); font-weight:bold;font-size:14px'

interface LogOptions {
  source: keyof typeof sources
  message: string
  method?: string
  data?: any
}

const sources = {
  useAuth: false,
  useEntityLoader: false,
  loadModelClasses: false,
  main: true,
  i18n: true,
  EntityListView: true,
  useApiRequest: true,
  LoginPage: true,
  RelationField: true,
}

const sourcesColors = {
  useAuth: LOG_COMPOSABLES_COLOR,
  useEntityLoader: LOG_LOADER_COLOR,
  loadModelClasses: LOG_LOADER_COLOR,
  main: LOG_FILES_COLOR,
  i18n: LOG_FILES_COLOR,
  EntityListView: LOG_VIEWS_COLOR,
  useApiRequest: LOG_COMPOSABLES_COLOR,
  RelationField: LOG_COMPONENTS_COLOR,
}

const hookColors = {
  'watch': LOG_HOOK_COLOR,
  'update:options': LOG_HOOK_COLOR,
  'fetchItems': LOG_HOOK_COLOR,
}

export function useBdLogger() {
  const log = ({ source, message, method, data }: LogOptions) => {
    if (sources[source]) {
      const sourceLabel = `%c[${source}]`
      const methodLabel = method ? `%c[${method}]` : ''

      if (data !== undefined) {
        return console.log(
          `${sourceLabel}${methodLabel}`,
          sourcesColors[source],
          ...(method ? [hookColors[method as keyof typeof hookColors]] : []),
          message,
          data,
        )
      }
      else {
        return console.log(
          `${sourceLabel}${methodLabel}`,
          sourcesColors[source],
          ...(method ? [hookColors[method as keyof typeof hookColors]] : []),
          message,
        )
      }
    }
  }

  const config = (source: keyof typeof sources, enabled: boolean) => {
    sources[source] = enabled
  }

  return { log, config }
}
