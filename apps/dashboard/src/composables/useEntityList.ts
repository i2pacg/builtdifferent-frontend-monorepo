import type { SortItem, TableHeader, TableHeaders } from '@/interfaces'
import type { Constructor, Model, OrderDirection } from 'pinia-orm'
import type { ComputedRef } from 'vue'
import { EntityPreferences } from '@/data/models/preferences.model'
import { useAxiosRepo } from '@pinia-orm/axios'
import { useRepo } from 'pinia-orm'

interface UseEntityListReturn {
  tableHeaders: ComputedRef<TableHeaders>
  items: ComputedRef<Model[]>
  loading: Ref<boolean>
  page: Ref<number>
  itemsPerPage: Ref<number>
  sortBy: Ref<SortItem>
  selected: Ref<number[]>
  totalItems: Ref<number>
  fetchItems: () => Promise<void>
  refreshData: () => Promise<void>
  handleDelete: (idOrIds: number | number[]) => Promise<void>
}

export async function useEntityList(entity: string): Promise<UseEntityListReturn> {
  const { model, fields, preferences, relations } = await useEntity(entity)
  console.log('useEntityList', preferences.value)
  const { itemsPerPage, sortBy, columnsVisible } = toRefs(preferences.value)
  // const itemsPerPage = ref(preferences.value.itemsPerPage)
  const totalItems: Ref<number> = ref(0)
  const page = ref(1)
  const loading = ref(false)
  const selected = ref([])
  // Get crud config from model
  if (columnsVisible.value.length === 0) {
    columnsVisible.value = Object.keys(fields.value)
  }
  const tableHeaders: ComputedRef<TableHeaders> = computed<TableHeaders>(() => {
    const headers: TableHeaders = [/* {
      key: 'name',
      title: t('common.columns.actions.header'),
      align: 'center',
      sortable: false,
      fixed: false,
      width: 100,
    }, */
      {
        key: 'value',
        title: 'Value',
        align: 'center',
        sortable: false,
        fixed: false,
        width: 100,
      },
      {
        key: 'actions',
        title: 'common.columns.actions.header',
        align: 'center',
        sortable: false,
        fixed: false,
        width: 100,
      },
    ]
    /* .sort((a, b) => Object.keys(columns.value).indexOf(a.key) - Object.keys(columns.value).indexOf(b.key)) */
    /* headers.concat([{
      key: 'name',
      title: t('common.columns.actions.header'),
      align: 'center',
      sortable: false,
      fixed: false,
      width: 100,
    }, {
      key: 'actions',
      title: t('common.columns.actions.header'),
      align: 'center',
      sortable: false,
      fixed: false,
      width: 100,
    }]) */
    return headers
  })
  /*   const config = useBdCrudRepo(model).crud() */

  // Get items from repo with current preferences
  const items = computed(() => {
    // Using direct computed properties from crudRuntime
    const query = useRepo(model)
      .offset((page.value - 1) * itemsPerPage.value)
      .limit(itemsPerPage.value)
    // Apply sorting
    sortBy.value.forEach((sort) => {
      query.orderBy(sort.key, sort.order as OrderDirection)
    })
    relations.forEach((relation) => {
      query.with(relation)
    })
    return query.get()
  })

  const fetchItems = async () => {
    console.log('fetchItems')
    loading.value = true
    try {
      /*  const response = await useAxiosRepo(model).api().getPage({
         page: page.value,
         itemsPerPage: itemsPerPage.value,
         params: {
           sortBy: sortBy.value,

         },
       })

       if (response?.total)
         totalItems.value = response.total */
    } /*        filters: filters.value,
    columns: columnsVisible.value, */
    catch (error) {
      console.error('Fetch error:', error)
      // Could integrate with a toast system here
    }
    finally {
      loading.value = false
    }
  }

  const handleDelete = async (idOrIds: number | number[]) => {
    loading.value = true
    console.log('handleDelete', idOrIds)
    try {
      /*   if (Array.isArray(idOrIds)) {
          await useAxiosRepo(model).api().deleteBulk({ ids: idOrIds })
          crudRuntime.clearSelected()
        }
        else {
          await useAxiosRepo(model).api().delete(`${config.model}/${idOrIds}`)
        } */
      await fetchItems()
    }
    catch (error) {
      console.error('Delete error:', error)
      // Could integrate with a toast system here
    }
    finally {
      loading.value = false
    }
  }

  // Watch for changes in preferences that should trigger a refresh
  watch(
    [
      () => preferences.value.itemsPerPage,
      () => preferences.value.sortBy,
      () => preferences.value.columnsVisible,
      /*    () => crudRuntime.page,
      () => crudRuntime.itemsPerPage,
      () => crudRuntime.sortBy,
      () => crudRuntime.filters,
      () => crudRuntime.columnsVisible, */
    ],
    () => fetchItems(),
    { deep: true },
  )

  // Initial fetch
  /*   await onMounted(() => {
    fetchItems()
  })
 */
  // Cleanup
  /*   await onUnmounted(() => {
  })
 */
  return {
    items,
    totalItems,
    loading,
    page,
    itemsPerPage,
    sortBy,
    tableHeaders,
    selected,

    /*   config, */
    fetchItems,
    refreshData: fetchItems,
    handleDelete,
  }
}
