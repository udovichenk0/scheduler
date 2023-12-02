import { createStore, createEvent, sample } from "effector"

import { router } from "@/shared/routing"

export const createIdModal = () => {
  const $id = createStore<Nullable<string>>(null)
  const open = createEvent<string>()
  const close = createEvent()

  sample({
    clock: open,
    target: $id, 
  })
  sample({
    clock: close,
    fn: () => null,
    target: $id, 
  })
  sample({
    clock: router.$path,
    source: $id,
    filter: (id) => !!id,
    target: close,
  })
  return {
    $id,
    open,
    close,
  }
}