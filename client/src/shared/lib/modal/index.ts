import { createStore, createEvent, sample, createEffect } from "effector"

import { router } from "@/shared/routing/router.ts"

import { singleton } from "../effector/singleton.ts"
import { isEsc } from "../key-utils"
import { setupListener } from "../effector/setup-listener"

const createModalsManager = () => {
  const $ids = createStore<string[]>([])
  const $onCloseCallbacks = createStore<Record<string, () => void>>({})
  const open = createEvent<string>()
  // behave like a close event but does trigger onCloseCallback
  const cancel = createEvent()
  const close = createEvent()
  const modalClosed = createEvent<string>()
  const closeAll = createEvent()
  const startListener = createEvent()
  const stopListener = createEvent()
  const destroy = createEvent<string>()
  const registerOnCloseCallback = createEvent<{ id: string; fn: () => void }>()
  const keydown = setupListener<KeyboardEvent>({
    event: "keydown",
    start: startListener,
    stop: stopListener,
  })
  sample({
    clock: open,
    source: $ids,
    filter: (ids) => !ids.length,
    target: startListener,
  })

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
    fn: (ids) => ids[ids.length - 1],
    target: modalClosed,
  })

  sample({
    clock: close,
    source: $ids,
    filter: (ids) => ids.length > 0,
    fn: (ids) => ids.slice(0, ids.length - 1),
    target: $ids,
  })
  sample({
    clock: keydown,
    source: $ids,
    filter: (ids, keyEvent) => isEsc(keyEvent) && ids.length > 0,
    target: close,
  })
  sample({
    clock: close,
    source: $ids,
    filter: (ids) => !ids.length,
    target: stopListener,
  })

  sample({
    clock: closeAll,
    source: $ids,
    filter: (ids) => ids.length > 0,
    target: [$ids.reinit, stopListener],
  })

  sample({
    clock: cancel,
    source: $ids,
    filter: (ids) => ids.length > 0,
    fn: (ids) => ids.slice(0, ids.length - 1),
    target: $ids,
  })
  sample({
    clock: cancel,
    source: $ids,
    filter: (ids) => !ids.length,
    target: stopListener,
  })

  sample({
    clock: keydown,
    source: $ids,
    filter: (ids, keyEvent) => isEsc(keyEvent) && !ids.length,
    target: stopListener,
  })

  sample({
    clock: router.$path,
    source: $ids,
    filter: (ids) => !!ids.length,
    target: closeAll,
  })

  const triggerOnCloseCallbackFx = createEffect(
    ({ cbs, id }: { cbs: Record<string, () => void>; id: string }) => {
      const callback = cbs[id]
      if (callback) {
        callback()
      }
    },
  )
  sample({
    clock: modalClosed,
    source: $onCloseCallbacks,
    filter: (cbs, id) => !!cbs[id],
    fn: (cbs, id) => ({ cbs, id }),
    target: triggerOnCloseCallbackFx,
  })
  sample({
    clock: destroy,
    source: $onCloseCallbacks,
    filter: (cbs, id) => !!cbs[id],
    fn: (cbs, id) => {
      let obj = {}
      for (const key in cbs) {
        if (key != id) {
          obj = { ...obj, [key]: cbs[key] }
        }
      }
      return obj
    },
    target: $onCloseCallbacks,
  })

  sample({
    clock: registerOnCloseCallback,
    source: $onCloseCallbacks,
    fn: (cbs, { id, fn }) => ({ ...cbs, [id]: fn }),
    target: $onCloseCallbacks,
  })

  function isOpen(ids: string[]) {
    return (id: string) => ids.includes(id)
  }

  return {
    $ids,
    open,
    close,
    cancel,
    modalClosed,
    isOpen,
    registerOnCloseCallback,
    destroy,
  }
}

export const $$modal = singleton(createModalsManager)
