import type { ApiResponse, PagingResponse } from '@/interfaces'
import type { Response } from '@pinia-orm/axios'
import type { AxiosResponse } from 'axios'
import { isPagingResponse } from '@/helpers'
import { CastAttribute, Model, useRepo } from 'pinia-orm'
import { Attr, Cast } from 'pinia-orm/decorators'
import { CustomProperties } from './customProperties.model'

class CustomPropertiesCast extends CastAttribute {
  get(value?: Record<string, string>): CustomProperties {
    if (!value)
      return new CustomProperties()
    return new CustomProperties(value)
  }
}
export class Media extends Model {
  static entity: string = 'media'
  static primaryKey = 'id'
  @Attr(null) declare id: number | null
  @Attr() declare name: string
  @Attr('') declare fileName: string
  @Attr('') declare modelType: string
  @Attr() declare modelId: number
  @Attr('') declare mimeType: string
  @Attr('') declare disk: string
  @Attr('') declare conversionsDisk: string
  @Attr(0) declare size: number
  @Attr([]) declare manipulations: Record<string, unknown>[]
  @Cast(() => CustomPropertiesCast) @Attr() declare customProperties: CustomProperties
  @Attr({}) declare generatedConversions: Record<string, boolean>
  @Attr([]) declare responsiveImages: Record<string, unknown>[]
  @Attr(0) declare orderColumn: number
  @Attr('') declare originalUrl: string
  @Attr('') declare previewUrl: string
  @Attr('') declare createdAt: string
  @Attr('') declare uuid: string
  @Attr('') declare collectionName: string

  static config = {
    axiosApi: {
      actions: {
        fetchById({
          id,
          params,
          callback,
        }: {
          id: number | string
          params?: Record<string, unknown>
          callback?: (response: AxiosResponse<ApiResponse<PagingResponse | Record<string, unknown>>>) => void
        }): Promise<Record<string, unknown> | undefined> {
          console.log('::fetchById::id', id)
          return this.get(`media/${id}`, {
            params: { ...params },
            dataTransformer: (response: AxiosResponse<ApiResponse<PagingResponse | Record<string, unknown>>>) => {
              console.log('::fetchById::response', response)
              if (callback)
                callback(response)
              const { data: { result } } = response
              return result
            },
          }).catch((error: any) => {
            console.error('::fetchById::error', error)
          })
        },
        getPage({
          page = 1,
          itemsPerPage = 10,
          params = {},
          callback,
        }: {
          page?: number
          itemsPerPage?: number
          params?: Record<string, unknown>
          callback?: (response: AxiosResponse<ApiResponse<PagingResponse | Record<string, unknown>>>) => void
        }): Promise<Record<string, unknown> | undefined> {
          return this.get('media', {
            params: {
              page,
              itemsPerPage,
              ...params,
            },
            dataTransformer: (response: AxiosResponse<ApiResponse<PagingResponse | Record<string, unknown>>>) => {
              if (callback)
                callback(response)
              const { data: { result } } = response
              if (isPagingResponse(result))
                return result.data
              else
                return result
            },
          }).catch((error: any) => {
            console.error('::getPage::error', error)
          })
        },
        destroy(idOrIds: number | number[]): Promise<void | number[]> {
          console.log('::MediaModel:: delete', idOrIds)
          if (!Array.isArray(idOrIds)) {
            return this.delete(`media/${idOrIds}`, { delete: idOrIds })
          }
          else {
            console.log('::MediaModel:: delete', idOrIds)
            return this.post('media/bulk-destroy', { ids: idOrIds }, { save: false }).then((result: Response) => {
              console.log('::delete::result', result)
              const { response: { data } } = result
              const notDeleted = data && data.result && Array.isArray(data.result) && data.result.length > 0 ? data.result : []
              useRepo(Media).destroy(idOrIds.filter(id => !notDeleted.includes(id)))
              return notDeleted
            })
          }
        },
      },
    },
  }
}
