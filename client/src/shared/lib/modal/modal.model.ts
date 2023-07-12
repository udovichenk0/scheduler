import {createEvent, createStore} from "effector";
//TODO move out to local state, bacause its not a buisiness logic, its just a show/hide
export const modalFactory = () => {
  const toggleTriggered = createEvent()
  const $isOpened = createStore(false)
    .on(toggleTriggered, (state) => !state)
  return {
    toggleTriggered,
    $isOpened
  }
}