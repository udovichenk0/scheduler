import { createEvent, createStore, sample } from "effector"

export const tabModelFactory = <Tab>({
  defaultValue
}:{
  defaultValue: Tab
}) => {
  const tabSelected = createEvent<Tab>()
  const reset = createEvent()

  const $activeTab = createStore<Tab>(defaultValue)

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