import {createEvent, createStore} from "effector";

export const modalFactory = () => {
    const toggleTriggered = createEvent()
    const $isOpened = createStore(false)
        .on(toggleTriggered, (state) => !state)
    return {
        toggleTriggered,
        $isOpened
    }
}