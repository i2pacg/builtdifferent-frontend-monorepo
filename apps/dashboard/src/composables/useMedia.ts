import type { Media } from '@/data/models/media.model'
import type { MediaFunctions } from '@/interfaces'

function useMedia(model: string): MediaFunctions {
  const upload = async (media: File | File[], idOrSlug: number | string, collectionName: string): Promise<void> => {
    try {
      console.log('uploading media', media)
      const formData: FormData = new FormData();
      (Array.isArray(media) ? media : [media]).forEach((file) => {
        formData.append('files[]', file)
      })
      console.log('Content-Type multipart/form-data', formData)
      const addedMedia = await useApiRequest<Media>(`/api/media/add/${model}/${idOrSlug}/${collectionName}`).store(
        formData,
        {
          'Content-Type': 'multipart/form-data',
        },
      )
      console.log('addMedia', addedMedia)
    }
    catch (error) {
      console.error(error)
    }
  }
  const deleteMedia = async (ids: number[]): Promise<void> => {
    try {
      console.log('deleting media', ids)
      const deletedMedia = await useApiRequest<Media>(`/api/media/bulk-destroy`).store({ ids })
      console.log('deletedMedia', deletedMedia)
    }
    catch (error) {
      console.error(error)
    }
  }
  const updateMedia = async (media: FormData): Promise<void> => {
    try {
      const updatedMedia = await useApiRequest<Media>(`/api/media/update/${model}`).store(media)
      console.log('updatedMedia', updatedMedia)
    }
    catch (error) {
      console.error(error)
    }
  }
  return {
    upload,
    deleteMedia,
    updateMedia,
  }
}

export default useMedia
