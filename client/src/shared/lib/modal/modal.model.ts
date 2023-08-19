import { createEvent, createStore, sample } from "effector"

export const createModal = ({
  closeOnClickOutside = true,
}: {
  closeOnClickOutside?: boolean
}) => {
  //TODO make a close and open events
  const toggleTriggered = createEvent()
  const clickOutsideTriggered = createEvent()
  const $isOpened = createStore(false).on(toggleTriggered, (state) => !state)
  if (closeOnClickOutside) {
    sample({
      clock: clickOutsideTriggered,
      fn: () => false,
      target: $isOpened,
    })
  }

  return {
    toggleTriggered,
    clickOutsideTriggered,
    $isOpened,
  }
}

export type ModalType = ReturnType<typeof createModal>
