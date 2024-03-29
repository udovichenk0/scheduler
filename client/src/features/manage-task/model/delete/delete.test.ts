import { fork, allSettled } from "effector"
import { describe, expect, test, vi } from "vitest"

import { $$task } from "@/entities/task/task-item"
import { $$session } from "@/entities/session"

import { removeTaskFactory } from "./task.model"
const tasks = [
  {
    id: "1",
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: "1",
    date_created: "2023-12-03T11:11:51.227Z",
    is_deleted: true,
  },
]
const returnedTask = {
  id: "1",
  title: "without date",
  description: "",
  type: "inbox",
  status: "INPROGRESS",
  start_date: null,
  user_id: "1",
  date_created: "2023-12-03T11:11:51.227Z",
  is_deleted: true,
}
const $$removeTask = removeTaskFactory()
describe("delete task", () => {
  test("delete task from database if user is authenticated", async () => {
    const { taskDeletedById, _ } = $$removeTask
    const mock = vi.fn(() => returnedTask)
    const scope = fork({
      values: [
        [$$session.$isAuthenticated, true],
        [$$task.$tasks, tasks],
      ],
      handlers: [[_.deleteTaskQuery.__.executeFx, mock]],
    })
    await allSettled(taskDeletedById, {
      scope,
      params: "1",
    })
    expect(mock).toBeCalled()
    expect(mock).toBeCalledWith("1")
    expect(mock).toReturnWith(returnedTask)
    expect(scope.getState($$task.$tasks)).toStrictEqual([])
  })
  test("delete task from localstorage if user is not authenticated", async () => {
    const { taskDeletedById, _ } = $$removeTask
    const mock = vi.fn(() => ({ result: returnedTask }))
    const scope = fork({
      values: [
        [$$session.$isAuthenticated, false],
        [$$task.$tasks, tasks],
      ],
      handlers: [[_.deleteTaskFromLsFx, mock]],
    })
    await allSettled(taskDeletedById, {
      scope,
      params: "1",
    })
    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toBeCalledWith(null, "1")
    expect(mock).toReturnWith({ result: returnedTask })
    expect(scope.getState($$task.$tasks)).toStrictEqual([])
  })
})
