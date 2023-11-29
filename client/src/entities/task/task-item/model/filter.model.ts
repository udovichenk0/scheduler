import { createStore, createEvent, sample } from "effector"

import { SortType, Task } from "../type"

export const createFilter = () => {
  const $sortType = createStore<SortType>("alph_asc")
  const sort = createEvent<SortType>()
  function filterBy(sortType: SortType, tasks: Task[] | null) {
    switch (sortType) {
      case "alph_asc":
        return [...tasks!.sort((a, b) => (a.title < b.title ? -1 : 1))]
      case "alph_desc":
        return [...tasks!.sort((a, b) => (a.title > b.title ? -1 : 1))]
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
