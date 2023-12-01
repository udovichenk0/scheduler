import { createStore, createEvent, sample } from "effector"

import { SortType, Task } from "../type"
import { SortingTypes } from "../config"
export const createFilter = () => {
  const $sortType = createStore<SortType>("alph_asc")
  const sort = createEvent<SortType>()
  function filterBy(sortType: SortType, tasks: Task[] | null) {
    switch (sortType) {
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
    filterBy,
    sort,
  }
}
