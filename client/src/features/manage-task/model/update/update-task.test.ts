import { fork, allSettled } from "effector"
import { test, expect, vi, describe, beforeEach } from "vitest"
import { createRoute } from "atomic-router"

import { $$session } from "@/entities/session"
import { TaskFactory, taskFactory } from "@/entities/task/task-item"

import { taskApi } from "@/shared/api/task"

import { UpdateTaskFactory, updateTaskFactory } from "./task.model"

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

const updatedTasks = [
  {
    id: "1",
    title: "title",
    description: "my description",
    type: "inbox",
    status: "FINISHED",
    start_date: null,
    user_id: "1",
    date_created: "2023-12-03T11:11:51.227Z",
    is_deleted: false,
  },
]

const returnedValue = {
  id: "1",
  title: "title",
  description: "my description",
  type: "inbox",
  status: "FINISHED",
  start_date: null,
  user_id: "1",
  date_created: "2023-12-03T11:11:51.227Z",
  is_deleted: false,
}

let $$updateTask: UpdateTaskFactory
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
  $$updateTask = updateTaskFactory()
})

describe("update task", () => {
  test("should update task when user is authenticated", async () => {
    const mock = vi.fn(() => returnedValue)
    const {
      $status,
      $description,
      $isAllowToSubmit,
      $title,
      $type,
      $startDate,
      updateTaskTriggeredById,
    } = $$updateTask
    const scope = fork({
      values: [
        [$$mockTasks.$tasks, tasks],
        [$title, "title"],
        [$description, "my description"],
        [$status, "FINISHED"],
        [$type, "inbox"],
        [$startDate, null],
        [$$session.$isAuthenticated, true],
        [$isAllowToSubmit, true],
      ],
      handlers: [[taskApi.updateTaskMutation.__.executeFx, mock]],
    })
    await allSettled(updateTaskTriggeredById, { scope, params: "5" })

    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toReturnWith(returnedValue)
    expect(scope.getState($$mockTasks.$tasks)).toStrictEqual(updatedTasks)
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe(null)
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
  test("should update task when user is not authenticated", async () => {
    const mock = vi.fn(() => ({ result: returnedValue }))
    const {
      $status,
      $description,
      $isAllowToSubmit,
      $title,
      $type,
      $startDate,
      updateTaskTriggeredById,
    } = $$updateTask
    const scope = fork({
      values: [
        [$$mockTasks.$tasks, tasks],
        [$title, "title"],
        [$description, "my description"],
        [$status, "FINISHED"],
        [$type, "inbox"],
        [$startDate, null],
        [$$session.$isAuthenticated, false],
        [$isAllowToSubmit, true],
      ],
      handlers: [[taskApi.updateTaskLs, mock]],
    })
    await allSettled(updateTaskTriggeredById, { scope, params: "1" })

    const fields = {
      data: {
        title: "title",
        description: "my description",
        type: "inbox",
        status: "FINISHED",
        start_date: null,
      },
      id: "1",
    }
    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toReturnWith({ result: returnedValue })
    expect(mock).toBeCalledWith(fields)
    expect(scope.getState($$mockTasks.$tasks)).toStrictEqual(updatedTasks)
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe(null)
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
})
