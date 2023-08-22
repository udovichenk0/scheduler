import { createEvent, createStore, sample } from "effector"

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
      fn: () => false,
      target: $isOpened,
    })
  }

  return {
    clickOutsideTriggered,
    $isOpened,
    open,
    close,
  }
}

export type ModalType = ReturnType<typeof createModal>
