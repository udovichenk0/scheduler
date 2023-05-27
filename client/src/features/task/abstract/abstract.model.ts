import { combine, createEvent, createStore, sample } from "effector"

export const checkToggle = createEvent<boolean>()
export const titleChanged = createEvent<string>()
export const noteChanged = createEvent<string>()

export const $title = createStore('')
export const $note = createStore('')
export const $done = createStore(false)

export const $fileds = combine($title, $note, $done, (title, note, done) => ({title, note, done}))

sample({
    clock: titleChanged,
    target: $title
})
sample({
    clock: checkToggle,
    source: $done,
    fn: (value) => !value,
    target: $done
})
sample({
    clock: noteChanged,
    target: $note
})
