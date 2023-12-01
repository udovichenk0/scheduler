import { fork, allSettled } from "effector"
import { expect, test, vi } from "vitest"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { authApi } from "@/shared/api/auth"

import { submitTriggered } from "./logout.model"

const tasks = {
  "1": {
    id: "1",
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: "1",
  },
}
test("logout", async () => {
  const mock = vi.fn()
  const scope = fork({
    values: [[$$task._.$taskKv, tasks]],
    handlers: [[authApi.logoutQuery.__.executeFx, mock]],
  })
  await allSettled(submitTriggered, { scope })
  expect(mock).toHaveBeenCalled()
  expect(scope.getState($$task.$taskKv)).toStrictEqual(null)
  expect(scope.getState($$session.$user)).toBeNull()
})
