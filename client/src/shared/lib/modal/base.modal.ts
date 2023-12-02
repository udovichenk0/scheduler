import { createEvent, createStore, sample } from "effector"

import { router } from "@/shared/routing"

export const createModal = ({
  closeOnClickOutside = true,
}: {
  closeOnClickOutside?: boolean
}) => {
  const open = createEvent()
  const close = createEvent()
  const clickOutsideTriggered = createEvent()
  const $isOpened = createStore(false)
    .on(open, () => true)
    .on(close, () => false)
  if (closeOnClickOutside) {
    sample({
      clock: clickOutsideTriggered,
      target: close,
    })
  }
  sample({
    clock: router.$path,
    filter: $isOpened,
    target: close,
  })
  return {
    clickOutsideTriggered,
    $isOpened,
    open,
    close,
  }
}

export type ModalType = ReturnType<typeof createModal>
