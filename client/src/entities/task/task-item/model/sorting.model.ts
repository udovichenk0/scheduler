import { createStore, createEvent, sample } from "effector"

import { SortType, Task } from "../type"
import { SortingTypes } from "../config"
export const createSorting = () => {
  const $sortType = createStore<SortType>(SortingTypes.DATE_CREATED_ASC)
  const sort = createEvent<SortType>()
  function sortBy(sortType: SortType, tasks: Nullable<Task[]>) {
    switch (sortType) {
      case SortingTypes.DATE_CREATED_ASC: 
        return [...tasks!.sort((a, b) => (a.date_created < b.date_created ? -1 : 1))]
      case SortingTypes.ALPH_ASC:
        return [...tasks!.sort((a, b) => (a.title < b.title ? -1 : 1))]
      case SortingTypes.ALPH_DESC:
        return [...tasks!.sort((a, b) => (a.title > b.title ? -1 : 1))]
      case SortingTypes.TIME_ASC:
        return [...tasks!.sort((a,b ) => (a.start_date! < b.start_date! ? -1 : 1))]
      case SortingTypes.TIME_DESC:
        return [...tasks!.sort((a,b ) => (a.start_date! > b.start_date! ? -1 : 1))]
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
