import { createEvent, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { not } from "patronum";
import { resetEmailTriggered } from "@/features/authentication/by-email";
import { resetSigninPasswordTriggered } from "@/features/authentication/sign-in";
import { resetSignupPasswordTriggered } from "@/features/authentication/sign-up";
import { logoutQuery, signinQuery, signupQuery } from "@/shared/api/auth";
import { $accessToken, setTokenTriggered } from "@/shared/api/token";
import { getUserQuery } from "@/shared/api/user";


export enum FormEnum {
    email = 'email',
    login = 'login',
    register = 'register',
    options = 'options',
    logout = 'logout'
}
export const formSelected = createEvent<FormEnum>()
export const resetFormTriggered = createEvent()

export const $form = createStore<FormEnum>(FormEnum.options)

export const gate = createGate()

sample({
  clock: gate.close,
  filter: not($accessToken),
  target: resetFormTriggered
})

sample({
  clock: formSelected,
  target: $form
})

sample({
  clock: getUserQuery.finished.success,
  filter: ({result}) => !result.id,
  fn: () => FormEnum.register,
  target: $form
})

sample({
  clock: getUserQuery.finished.success,
  filter: ({result}) => Boolean(result.id),
  fn: () => FormEnum.login,
  target: $form
})

sample({
  clock: logoutQuery.finished.success,
  fiilter: Boolean,
  fn: () => FormEnum.email,
  target: $form
})

sample({
  clock: [signinQuery.finished.success, signupQuery.finished.success, setTokenTriggered],
  fn: () => FormEnum.logout,
  target: $form
})

sample({
  clock: resetFormTriggered,
  target: [$form.reinit!, resetEmailTriggered, resetSigninPasswordTriggered, resetSignupPasswordTriggered]
})