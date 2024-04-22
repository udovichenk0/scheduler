import { fork, allSettled } from "effector"
import { test, expect, vi, describe, beforeEach } from "vitest"
import { createRoute } from "atomic-router"

import { $$session } from "@/entities/session"
import { taskFactory, type TaskFactory } from "@/entities/task/task-item"

import { taskApi } from "@/shared/api/task"

import { TrashTaskFactory, trashTaskFactory } from "./task.model"

const tasks = [
  {
    id: "1",
    title: "without date",
    description: null,
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: "1",
    date_created: "2023-12-03T11:11:51.227Z",
    is_deleted: false,
  },
]
const returnedTask = {
  id: "1",
  title: "without date",
  description: null,
  type: "inbox",
  status: "INPROGRESS",
  start_date: null,
  user_id: "1",
  date_created: "2023-12-03T11:11:51.227Z",
  is_deleted: true,
}

let $$trashTask: TrashTaskFactory
let $$mockTasks: TaskFactory
beforeEach(() => {
  $$mockTasks = taskFactory({
    filter: ({ type }) => type == "inbox",
    api: {
      taskQuery: taskApi.inboxTasksQuery,
      taskStorage: taskApi.inboxTasksLs,
    },
    route: createRoute(),
  })
  $$trashTask = trashTaskFactory()
})

describe("trashTask factory", () => {
  test("should put task to trash if user is authenticated", async () => {
    const { taskTrashedById } = $$trashTask
    const mock = vi.fn(() => returnedTask)
    const scope = fork({
      values: [
        [$$session.$isAuthenticated, true],
        [$$mockTasks.$tasks, tasks],
      ],
      handlers: [[taskApi.trashTaskQuery.__.executeFx, mock]],
    })
    await allSettled(taskTrashedById, {
      scope,
      params: "1",
    })
    expect(mock).toBeCalledWith("1")
    expect(scope.getState($$mockTasks.$tasks)).toStrictEqual([])
  })
  test("should put task to trash if user is not authenticated", async () => {
    const { taskTrashedById } = $$trashTask
    const mock = vi.fn(() => ({ result: returnedTask }))
    const scope = fork({
      values: [
        [$$session.$isAuthenticated, false],
        [$$mockTasks.$tasks, tasks],
      ],
      handlers: [[taskApi.trashTaskLs, mock]],
    })
    await allSettled(taskTrashedById, {
      scope,
      params: "1",
    })

    expect(scope.getState($$mockTasks.$tasks)).toStrictEqual([])
  })
})
