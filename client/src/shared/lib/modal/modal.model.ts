import {createEvent, createStore, sample} from "effector";
//TODO move out to local state, bacause its not a buisiness logic, its just a show/hide
export const modalFactory = ({closeOnClickOutside = true}:{closeOnClickOutside?: boolean}) => {
  const toggleTriggered = createEvent()
  const clickOutsideTriggered = createEvent()
  const $isOpened = createStore(false)
    .on(toggleTriggered, (state) => !state)
  if (closeOnClickOutside) {
    sample({
      clock: clickOutsideTriggered,
      fn: () => false,
      target: $isOpened
    })
  }

  return {
    toggleTriggered,
    clickOutsideTriggered,
    $isOpened,
  }
}

export type ModalType = ReturnType<typeof modalFactory>