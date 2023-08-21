import { fork, allSettled } from "effector"
import { describe, expect, test, vi } from "vitest"

import { $taskKv } from "@/entities/task/tasks"
import { $isAuthenticated } from "@/entities/session"

import { createRemoveTaskFactory } from "."
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
const returnedTask = {
  id: "1",
  title: "without date",
  description: "",
  type: "inbox",
  status: "INPROGRESS",
  start_date: null,
  user_id: "1",
}
const $$removeTask = createRemoveTaskFactory()
describe("delete task", () => {
  test("delete task from database if user is authenticated", async () => {
    const { taskDeleted, _ } = $$removeTask
    const mock = vi.fn(() => returnedTask)
    const scope = fork({
      values: [
        [$isAuthenticated, true],
        [$taskKv, tasks],
      ],
      handlers: [[_.deleteTaskQuery.__.executeFx, mock]],
    })
    await allSettled(taskDeleted, {
      scope,
      params: {
        id: "1",
      },
    })
    expect(mock).toBeCalled()
    expect(mock).toBeCalledWith({ body: { id: "1" } })
    expect(mock).toReturnWith(returnedTask)
    expect(scope.getState($taskKv)).toStrictEqual({})
  })
  test("delete task from localstorage if user is not authenticated", async () => {
    const { taskDeleted, _ } = $$removeTask
    const mock = vi.fn(() => ({ result: returnedTask }))
    const scope = fork({
      values: [
        [$isAuthenticated, false],
        [$taskKv, tasks],
      ],
      handlers: [[_.deleteTaskFromLsFx, mock]],
    })
    await allSettled(taskDeleted, {
      scope,
      params: {
        id: "1",
      },
    })
    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toBeCalledWith({ id: "1" })
    expect(mock).toReturnWith({ result: returnedTask })
    console.log(scope.getState($taskKv))
    expect(scope.getState($taskKv)).toStrictEqual({})
  })
})
