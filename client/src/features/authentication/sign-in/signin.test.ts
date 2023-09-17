import { allSettled, fork } from "effector"
import { describe, test, expect, vi, afterEach } from "vitest"

import { $$session } from "@/entities/session"

import { signinQuery } from "@/shared/api/auth/auth.api"

import { $email } from "../by-email"

import { $password, $passwordError, passwordChanged, submitTriggered } from "."
const userDto = {
  user: {
    id: "1",
    email: "myemail@gmail.com",
    verified: true,
  },
  access_token: "access_token",
  refresh_token: "refresh_token",
}
const sessionUser = {
  id: "1",
  email: "myemail@gmail.com",
  verified: true,
}
describe("signin", () => {
  const mock = vi.fn(() => userDto)
  const scope = fork({
    values: [
      [$password, ""],
      [$email, "myemail@gmail.com"],
      [$$session.$user, null],
    ],
    handlers: [[signinQuery.__.executeFx, mock]],
  })
  afterEach(() => {
    mock.mockClear()
  })
  test("signin and set user to the store", async () => {
    await allSettled(passwordChanged, { scope, params: "mypassword" })

    expect(scope.getState($password)).toBe("mypassword")

    await allSettled(submitTriggered, { scope })
    expect(scope.getState($$session.$user)).toStrictEqual(sessionUser)
  })

  test("check password validation", async () => {
    await allSettled(passwordChanged, {
      scope,
      params:
        "1",
    })
    await allSettled(submitTriggered, { scope })
    // expect(scope.getState($passwordError)).not.toBeNull()
    console.log("klsjdfkasjlfjlsdfl")
    console.log(scope.getState($passwordError))
    expect(mock).not.toBeCalled()
  })
})
