import { createEvent, createStore, sample } from "effector";
import { checkUserFx } from "@/features/authentication/by-email";


export enum Form {
    email,
    login,
    register,
    options
}
export const setFormTriggered = createEvent<Form>()
export const resetFormTriggered = createEvent()

export const $formToShow = createStore<Form>(Form.options)


sample({
    clock: setFormTriggered,
    target: $formToShow
})

sample({
    clock: checkUserFx.doneData,
    filter: (data) => data === 1,
    fn: () => Form.register,
    target: $formToShow
})
sample({
    clock: checkUserFx.doneData,
    filter: (data) => data === 2,
    fn: () => Form.login,
    target: $formToShow
})

// reset form to options
sample({
    clock: resetFormTriggered,
    target: $formToShow.reinit!
})