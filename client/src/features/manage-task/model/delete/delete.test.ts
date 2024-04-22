import { fork, allSettled } from "effector"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { createRoute } from "atomic-router"

import { TaskFactory, taskFactory } from "@/entities/task/task-item"
import { $$session } from "@/entities/session"

import { taskApi } from "@/shared/api/task"

import { RemoveTaskFactory, removeTaskFactory } from "./task.model"
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

let $$mockTasks: TaskFactory
let $$removeTask: RemoveTaskFactory
beforeEach(() => {
  $$mockTasks = taskFactory({
    filter: ({ is_deleted }) => is_deleted,
    api: {
      taskQuery: taskApi.inboxTasksQuery,
      taskStorage: taskApi.inboxTasksLs,
    },
    route: createRoute(),
  })
  $$removeTask = removeTaskFactory($$mockTasks)
})
describe("delete task", () => {
  test("delete task from database if user is authenticated", async () => {
    const { taskDeletedById } = $$removeTask
    const mock = vi.fn(() => returnedTask)
    const scope = fork({
      values: [
        [$$session.$isAuthenticated, true],
        [$$mockTasks.$tasks, tasks],
      ],
      handlers: [[taskApi.deleteTaskMutation.__.executeFx, mock]],
    })
    await allSettled(taskDeletedById, {
      scope,
      params: "1",
    })
    expect(mock).toBeCalledWith("1")
    expect(scope.getState($$mockTasks.$tasks)).toStrictEqual([])
  })

  test("delete task from localstorage if user is not authenticated", async () => {
    const { taskDeletedById } = $$removeTask
    const mock = vi.fn(() => ({ result: returnedTask }))
    const scope = fork({
      values: [
        [$$session.$isAuthenticated, false],
        [$$mockTasks.$tasks, tasks],
      ],
      handlers: [[taskApi.deleteTaskLs, mock]],
    })
    await allSettled(taskDeletedById, {
      scope,
      params: "1",
    })
    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toBeCalledWith("1")
    expect(mock).toReturnWith({ result: returnedTask })
    expect(scope.getState($$mockTasks.$tasks)).toStrictEqual([])
  })
})
