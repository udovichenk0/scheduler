import { fork, allSettled } from "effector"
import { expect, test, vi } from "vitest"

import { $$task } from "@/entities/task/tasks"

import { logoutQuery } from "@/shared/api/auth"

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
    values: [[$$task.$taskKv, tasks]],
    handlers: [[logoutQuery.__.executeFx, mock]],
  })
  await allSettled(submitTriggered, { scope })
  expect(mock).toHaveBeenCalled()
  console.log(scope.getState($$task.$taskKv))
  console.log("asiodfjoasifdjo")
  // expect(scope.getState($$task.$taskKv)).toStrictEqual({})
})