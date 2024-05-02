import { allSettled, fork } from "effector"
import { test, expect, vi, describe, beforeEach } from "vitest"
import { createRoute } from "atomic-router"

import { modifyTaskFactory } from "@/entities/task/task-form"
import { $$session } from "@/entities/session"
import { TaskFactory, taskFactory } from "@/entities/task/task-item"
import { isInbox } from "@/entities/task/task-item/lib"

import { taskApi } from "@/shared/api/task"

import { CreateTaskFactory, createTaskFactory } from "./"
const tasks = [
  {
    id: "1",
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: "1",
    is_deleted: false,
    date_created: new Date(2024, 10, 10),
  },
]
const resultedTasks = [
  {
    id: "1",
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: "1",
    is_deleted: false,
    date_created: new Date(2024, 10, 10),
  },
  {
    id: "2",
    title: "second",
    description: "my note",
    type: "inbox",
    status: "FINISHED",
    start_date: null,
    user_id: "1",
    is_deleted: false,
    date_created: new Date(2024, 10, 10),
  },
]
const returnedTask = {
  id: "2",
  title: "second",
  description: "my note",
  type: "inbox",
  status: "FINISHED",
  start_date: null,
  user_id: "1",
  is_deleted: false,
  date_created: new Date(2024, 10, 10),
}

describe("create task", () => {
  let $$mockTasks: TaskFactory
  let $$createTask: CreateTaskFactory
  beforeEach(() => {
    $$mockTasks = taskFactory({
      filter: isInbox,
      api: {
        taskQuery: taskApi.inboxTasksQuery,
        taskStorage: taskApi.inboxTasksLs,
      },
      route: createRoute(),
    })
    $$createTask = createTaskFactory({
      $$modifyTask: modifyTaskFactory({
        defaultType: "inbox",
        defaultDate: null,
      }),
    })
  })
  test("should create task if user is authenticated", async () => {
    const mock = vi.fn(() => returnedTask)
    const {
      $title,
      $description,
      $status,
      $startDate,
      $isAllowToSubmit,
      $type,
      createTaskTriggered,
    } = $$createTask
    const scope = fork({
      values: [
        [$title, "sixth"],
        [$description, "my note"],
        [$status, "FINISHED"],
        [$startDate, null],
        [$type, "inbox"],
        [$$session.$isAuthenticated, true],
        [$isAllowToSubmit, true],
        [$$mockTasks.$tasks, tasks],
      ],
      handlers: [[taskApi.createTaskMutation.__.executeFx, mock]],
    })
    await allSettled(createTaskTriggered, { scope })
    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toBeCalledWith({
      title: "sixth",
      description: "my note",
      type: "inbox",
      status: "FINISHED",
      start_date: null,
    })
    expect(mock).toReturnWith(returnedTask)
    expect(scope.getState($$mockTasks.$tasks)).toStrictEqual(resultedTasks)
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe(null)
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
  test("Create task in localStorage if user is not authenticated", async () => {
    const mock = vi.fn(() => ({ result: returnedTask }))
    const {
      $title,
      $description,
      $status,
      $startDate,
      $isAllowToSubmit,
      $type,
      createTaskTriggered,
    } = $$createTask
    const scope = fork({
      values: [
        [$title, "sixth"],
        [$description, "my note"],
        [$status, "FINISHED"],
        [$startDate, null],
        [$type, "inbox"],
        [$$session.$isAuthenticated, false],
        [$isAllowToSubmit, true],
        [$$mockTasks.$tasks, tasks],
      ],
      handlers: [[taskApi.createTaskLs, mock]],
    })
    await allSettled(createTaskTriggered, { scope })
    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toBeCalledWith({
      body: {
        title: "sixth",
        description: "my note",
        type: "inbox",
        status: "FINISHED",
        start_date: null,
      },
    })
    expect(mock).toReturnWith({ result: returnedTask })
    expect(scope.getState($$mockTasks.$tasks)).toStrictEqual(resultedTasks)
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe(null)
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
})
