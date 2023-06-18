import { createEvent, createStore, sample } from "effector"

export const tabModelFactory = <List>({
  defaultValue
}:{
  defaultValue: List
}) => {
  const tabSelected = createEvent<List>()
  const reset = createEvent()

  const $activeTab = createStore<List>(defaultValue)

  sample({
    clock: tabSelected,
    target: $activeTab
  })
  sample({
    clock: reset,
    target: $activeTab.reinit!
  })
  return {
    reset,
    tabSelected,
    $activeTab
  }
}