import { createEvent, createStore, sample } from "effector";
import { resetEmailTriggered } from "@/features/authentication/by-email";
import { getUserQuery } from "@/shared/api/user";


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
    clock: getUserQuery.finished.success,
    filter: ({result}) => !result.id,
    fn: () => Form.register,
    target: $formToShow
})
sample({
    clock: getUserQuery.finished.success,
    filter: ({result}) => Boolean(result.id),
    fn: () => Form.login,
    target: $formToShow
})

// reset form to options
sample({
    clock: resetFormTriggered,
    target: [$formToShow.reinit!, resetEmailTriggered]
})