import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { resetEmailTriggered } from "@/features/authentication/by-email";
import { logoutQuery, signinQuery, signupQuery } from "@/shared/api/auth";
import { $accessToken, setTokenTriggered } from "@/shared/api/token";
import { getUserQuery } from "@/shared/api/user";


export enum Form {
    email,
    login,
    register,
    options,
    logout
}
export const setFormTriggered = createEvent<Form>()
export const resetFormTriggered = createEvent()

export const $formToShow = createStore<Form>(Form.options)

export const gate = createGate()

sample({
  clock: gate.close,
  target: resetFormTriggered
})

sample({
  clock: setFormTriggered,
  target: $formToShow
})

// if user entered email that does not exist, show register form
sample({
  clock: getUserQuery.finished.success,
  filter: ({result}) => !result.id,
  fn: () => Form.register,
  target: $formToShow
})

//otherwise show login form
sample({
  clock: getUserQuery.finished.success,
  filter: ({result}) => Boolean(result.id),
  fn: () => Form.login,
  target: $formToShow
})

// set email form after successful logout
sample({
  clock: logoutQuery.finished.success,
  fiilter: Boolean,
  fn: () => Form.email,
  target: $formToShow
})
// set logout form after being authorized
sample({
  clock: [signinQuery.finished.success, signupQuery.finished.success, setTokenTriggered],
  fn: () => Form.logout,
  target: $formToShow
})


// reset form to options
sample({
  clock: resetFormTriggered,
  target: [$formToShow.reinit!, resetEmailTriggered]
})