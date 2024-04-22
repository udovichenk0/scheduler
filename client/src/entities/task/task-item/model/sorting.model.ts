import { createStore, createEvent, sample } from "effector"

import { SortType, Task } from "../type"
import { SortTypes } from "../config"
export const createSorting = () => {
  const $sortType = createStore<SortType>(SortTypes.DATE_CREATED_ASC)
  const sort = createEvent<SortType>()
  function sortBy(sortType: SortType, tasks: Nullable<Task[]>) {
    switch (sortType) {
      case SortTypes.DATE_CREATED_ASC:
        return [
          ...tasks!.sort((a, b) => (a.date_created < b.date_created ? -1 : 1)),
        ]
      case SortTypes.ALPH_ASC:
        return [...tasks!.sort((a, b) => (a.title < b.title ? -1 : 1))]
      case SortTypes.ALPH_DESC:
        return [...tasks!.sort((a, b) => (a.title > b.title ? -1 : 1))]
      case SortTypes.TIME_ASC:
        return [
          ...tasks!.sort((a, b) => (a.start_date! < b.start_date! ? -1 : 1)),
        ]
      case SortTypes.TIME_DESC:
        return [
          ...tasks!.sort((a, b) => (a.start_date! > b.start_date! ? -1 : 1)),
        ]
    }
  }

  sample({
    clock: sort,
    target: $sortType,
  })

  return {
    $sortType,
    sortBy,
    sort,
  }
}

export type CreateSorting = ReturnType<typeof createSorting>
