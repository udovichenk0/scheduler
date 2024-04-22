import { fork, allSettled } from "effector"
import { beforeEach, expect, test, vi } from "vitest"
import { createRoute } from "atomic-router"

import { $$session } from "@/entities/session"
import { TaskFactory, taskFactory } from "@/entities/task/task-item"

import { authApi } from "@/shared/api/auth"
import { taskApi } from "@/shared/api/task"

import { submitTriggered } from "./logout.model"
const tasks = [
  {
    id: "1",
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: "1",
  },
]
const fakeUser = {
  id: "asdfasdf",
  email: "fakeemail@example.com",
  verified: true,
}
let $$mockTasks: TaskFactory
beforeEach(() => {
  $$mockTasks = taskFactory({
    filter: ({ is_deleted, type }) => !is_deleted && type == "inbox",
    api: {
      taskQuery: taskApi.inboxTasksQuery,
      taskStorage: taskApi.inboxTasksLs,
    },
    route: createRoute(),
  })
})
test("logout", async () => {
  const mock = vi.fn()
  const scope = fork({
    values: [
      [$$mockTasks.$tasks, tasks],
      [$$session.$user, fakeUser],
      [$$session.$isAuthenticated, true],
    ],
    handlers: [[authApi.logoutQuery.__.executeFx, mock]],
  })
  expect(scope.getState($$session.$user)).toStrictEqual(fakeUser)
  expect(scope.getState($$session.$isAuthenticated)).toBeTruthy()

  await allSettled(submitTriggered, { scope })

  expect(mock).toHaveBeenCalled()
  expect(scope.getState($$mockTasks.$tasks)).toStrictEqual([])
  expect(scope.getState($$session.$isAuthenticated)).toBeFalsy()
  expect(scope.getState($$session.$user)).toBeNull()
})
