import { fork, allSettled } from "effector"
import { test, expect, vi, describe } from "vitest"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { trashTaskFactory } from "./task.model"

const tasks = {
  "1": {
    id: "1",
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: "1",
    date_created: "2023-12-03T11:11:51.227Z",
    is_deleted: false,
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
  date_created: "2023-12-03T11:11:51.227Z",
  is_deleted: true,
}
const $$trashTask = trashTaskFactory()
describe("delete task", () => {
  test("delete task from database if user is authenticated", async () => {
    const { taskTrashedById, _ } = $$trashTask
    const mock = vi.fn(() => returnedTask)
    const scope = fork({
      values: [
        [$$session.$isAuthenticated, true],
        [$$task._.$taskKv, tasks],
      ],
      handlers: [[_.trashTaskQuery.__.executeFx, mock]],
    })
    await allSettled(taskTrashedById, {
      scope,
      params: "1",
    })
    expect(mock).toBeCalled()
    expect(mock).toBeCalledWith("1")
    expect(mock).toReturnWith(returnedTask)
    expect(scope.getState($$task.$taskKv)).toStrictEqual({ "1": returnedTask })
  })
  test("delete task from localstorage if user is not authenticated", async () => {
    const { taskTrashedById, _ } = $$trashTask
    const mock = vi.fn(() => ({ result: returnedTask }))
    const scope = fork({
      values: [
        [$$session.$isAuthenticated, false],
        [$$task._.$taskKv, tasks],
      ],
      handlers: [[_.trashTaskFromLsFx, mock]],
    })
    await allSettled(taskTrashedById, {
      scope,
      params: "1",
    })
    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toBeCalledWith(null, "1")
    expect(mock).toReturnWith({ result: returnedTask })
    expect(scope.getState($$task.$taskKv)).toStrictEqual({ "1": returnedTask })
  })
})
