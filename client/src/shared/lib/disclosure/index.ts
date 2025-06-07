import { createStore, createEvent, sample } from "effector"

import { router } from "@/shared/routing/router.ts"

import { singleton } from "../effector/singleton.ts"

const createModalsManager = () => {
  const $ids = createStore<string[]>([])
  const open = createEvent<string>()
  // behave like a close event but does trigger onCloseCallback
  const close = createEvent()
  const closeAll = createEvent()

  sample({
    clock: open,
    source: $ids,
    fn: (ids, id) => [...ids, id],
    target: $ids,
  })

  sample({
    clock: close,
    source: $ids,
    filter: (ids) => ids.length > 0,
    fn: (ids) => ids.slice(0, -1),
    target: $ids,
  })

  sample({
    clock: closeAll,
    source: $ids,
    filter: (ids) => ids.length > 0,
    target: [$ids.reinit],
  })

  sample({
    clock: router.$path,
    source: $ids,
    filter: (ids) => !!ids.length,
    target: closeAll,
  })

  function isOpen(ids: string[]) {
    return (id: string) => ids.includes(id)
  }

  return {
    $ids,
    open,
    close,
    isOpen,
  }
}

export const $$modal = singleton(createModalsManager)
