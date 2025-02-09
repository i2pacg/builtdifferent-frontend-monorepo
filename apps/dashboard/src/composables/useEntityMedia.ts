import type { Media } from '@/data/models/media.model'
import type { AllowedFileType } from '@/interfaces'
import type { MediaCollection, MediaCollections } from '@/interfaces/crud'
import type { Constructor, Model } from 'pinia-orm'
import type { ComputedRef, Ref } from 'vue'
import { useEntity } from '@/composables/useEntity'
import { useEntityDetails } from '@/composables/useEntityDetails'
import { asyncComputed } from '@vueuse/core'
import { useRepo } from 'pinia-orm'
import { computed, ref } from 'vue'

interface UseEntityMediaReturn {
  mediaCollections: MediaCollections | undefined
  fetchMedia: () => Promise<void>
  deleteMedia: (mediaId: number) => Promise<void>
  mediaItems: ComputedRef<Media[]>
  loading: Ref<boolean>
  getMediaCollection: (collectionName: string) => MediaCollection | undefined
  getCollectionMedia: (collectionName: string) => Media[]
  getCollectionMediaTypes: (collectionName: string) => string[]
  addMedia: (media: File | File[], idOrSlug: number | string, collectionName: string) => Promise<void>
}

export function useEntityMedia(entity: string, slug: string): UseEntityMediaReturn {
  const { model, modelName, mediaCollections } = useEntity(entity)
  const { loading, fetchItem } = useEntityDetails(entity, slug)
  const mediaItems = asyncComputed<Media[]>(async () => {
    console.log('Getting media items')
    const item = useRepo(model)
      .where('slug', e => e === slug)
      .with('media')
      .first()
    if (!item) {
      console.log('Item not found, fetching...')
      await fetchItem()
    }
    if (item && hasKey<Model>(item, 'media')) {
      console.log('Media found:', item)
      const data = item as unknown as { media: Media[] }
      return data.media
    }
    return []
  }) as ComputedRef<Media[]>

  const getMediaCollection = (collectionName: string): MediaCollection | undefined => {
    return mediaCollections![collectionName]
  }
  const getCollectionMediaTypes = (collectionName: string): string[] => {
    if (!mediaCollections || !mediaCollections[collectionName])
      return []
    if (Array.isArray(mediaCollections[collectionName].rules))
      return mediaCollections[collectionName].rules.map(f => f.fileType)
    return [mediaCollections[collectionName].rules.fileType]
  }
  const getCollectionMedia = (collectionName: string): Media[] => {
    if (mediaItems.value) {
      return mediaItems.value.filter(media => media.collectionName === collectionName)
    }
    return []
  }

  const fetchMedia = async (): Promise<void> => {
    loading.value = true
    try {
      // Check if the item exists in the offline repository

    }
    catch (error) {
      console.error('Failed to fetch media:', error)
    }
    finally {
      loading.value = false
    }
  }

  const addMedia = async (media: File | File[], idOrSlug: number | string, collectionName: string): Promise<void> => {
    console.log('Adding media:', media)
    const { upload } = useMedia(modelName.value)
    try {
      await upload(media, idOrSlug, collectionName)
      console.log('Media added successfully')
    }
    catch (error) {
      console.error('Failed to add media:', error)
    }
  }
  const deleteMedia = async (mediaId: number): Promise<void> => {
    loading.value = true
    try {
      await useAxiosRepo(model).api().deleteMedia({ id: slug, mediaId })

      /*   mediaItems.value = mediaItems.value!.filter(media => media.id !== mediaId) */
      console.log('Media deleted successfully')
    }
    catch (error) {
      console.error('Failed to delete media:', error)
    }
    finally {
      loading.value = false
    }
  }

  return {
    mediaCollections,
    getMediaCollection,
    getCollectionMedia,
    getCollectionMediaTypes,
    fetchMedia,
    deleteMedia,
    mediaItems,
    loading,
    addMedia,
  }
}
