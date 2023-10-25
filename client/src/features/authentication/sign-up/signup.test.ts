import { allSettled, fork } from "effector"
import { describe, test, expect, vi, beforeEach } from "vitest"

import { $$session } from "@/entities/session/session.model"

import { authApi } from "@/shared/api/auth"

import { $email } from "../check-email"

import { $password, $passwordError, passwordChanged, submitTriggered } from "."
describe("signup", () => {
  const mock = vi.fn()
  const scope = fork({
    values: [
      [$password, ""],
      [$email, "myemail@gmail.com"],
      [$$session.$user, null],
      [$passwordError, null],
    ],
    handlers: [[authApi.signupQuery.__.executeFx, mock]],
  })
  beforeEach(() => mock.mockClear())
  test("signup and set user to the store", async () => {
    await allSettled(passwordChanged, { scope, params: "mypassword" })

    expect(scope.getState($password)).toBe("mypassword")

    await allSettled(submitTriggered, { scope })
    expect(mock).toHaveBeenCalled()
  })
  test("check password validation", async () => {
    await allSettled(passwordChanged, { scope, params: "1" })
    await allSettled(submitTriggered, { scope })
    expect(scope.getState($passwordError)).not.toBeNull()
    expect(mock).not.toBeCalled()
  })
})
