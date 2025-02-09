import { VAutocomplete, VCheckbox, VRadio, VSwitch } from 'vuetify/components'

declare global {
  interface Window {
    bdSettings: Record<string, unknown>
  }
}
export const DISPLAY_MODES = {
  autocomplete: { value: markRaw(VAutocomplete), icon: '$mdi-magnify', title: 'common.listing.display.search' },
  switch: { value: markRaw(VSwitch), icon: '$mdi-toggle-switch', title: 'common.listing.display.switch' },
  checkbox: { value: markRaw(VCheckbox), icon: '$mdi-checkbox-marked', title: 'common.listing.display.checkbox' },
  radio: { value: markRaw(VRadio), icon: '$mdi-radiobox-marked', title: 'common.listing.display.radio' },
} as const

export type DisplayMode = keyof typeof DISPLAY_MODES

// Define a type for media configuration
interface MediaTypeConfig {
  mime_types: string[]
  extensions: string[]
}
export const LOG_STORES_COLOR = 'color:rgb(135, 154, 222); font-weight:bold;font-size:14px'
export const LOG_VIEWS_COLOR = 'color:rgb(222, 154, 135); font-weight:bold;font-size:14px'
export const LOG_COMPONENTS_COLOR = 'color:rgb(154, 222, 135); font-weight:bold;font-size:14px'
export const LOG_LOADER_COLOR = 'color:rgb(138, 138, 89); font-weight:bold;font-size:14px'
export const LOG_FILES_COLOR = 'color: #deb887;font-weight:bolder;font-size:15px'
export const LOG_COMPOSABLES_COLOR = 'color: #ff4500;font-weight:bolder;font-size:15px'
export const LOG_WATCH_COLOR = 'color: #FFD700;font-weight:bolder;font-size:15px'
export const LOG_METHOD_COLOR = 'color:rgb(255, 58, 192);font-weight:bolder;font-size:15px'

// Media configuration object
export const MEDIA_CONFIG: Record<string, MediaTypeConfig> = {
  image: {
    mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/*'],
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  },
  pdf: {
    mime_types: ['application/pdf'],
    extensions: ['pdf'],
  },
  audio: {
    mime_types: ['audio/aac', 'audio/ogg', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/*'],
    extensions: ['aac', 'ogg', 'oga', 'mp3', 'wav'],
  },
  video: {
    mime_types: ['video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/*'],
    extensions: ['mp4', 'm4v', 'mov', 'ogv', 'webm'],
  },
  archive: {
    mime_types: ['application/zip', 'application/x-compressed-zip', 'multipart/x-zip'],
    extensions: ['zip'],
  },
  document: {
    mime_types: ['text/plain', 'application/plain', 'text/xml', 'text/json', 'application/json', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['doc', 'docx', 'txt', 'text', 'xml', 'json'],
  },
  spreadsheet: {
    mime_types: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    extensions: ['xls', 'xlsx'],
  },
  presentation: {
    mime_types: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
    extensions: ['ppt', 'pptx', 'ppsx'],
  },
}

// Method to get media type by MIME type
export function getMediaTypeByMimeType(mimeType: string): string | null {
  for (const [type, config] of Object.entries(MEDIA_CONFIG)) {
    if (config.mime_types.includes(mimeType)) {
      return type
    }
  }
  return null
}

export const TABLE_ACTIONS_HEADER = {
  key: 'actions',
  title: 'columns.default.actions.header',
  align: 'center',
  sortable: false,
  fixed: false,
  width: 100,
}

export const ITEMS_PER_PAGE_OPTIONS = [
  {
    title: 'common.iterator.5',
    value: 5,
  },
  {
    title: 'common.iterator.10',
    value: 10,
  },
  {
    title: 'common.iterator.25',
    value: 25,
  },
  {
    title: 'common.iterator.50',
    value: 50,
  },
  {
    title: 'common.iterator.all',
    value: -1,
  },
]
