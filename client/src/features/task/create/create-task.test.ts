import { allSettled, fork } from "effector"
import { test, expect, vi, describe } from "vitest"

import { $isAuthenticated } from "@/entities/session"
import { $taskKv } from "@/entities/task/tasks"

import { createTaskQuery } from "@/shared/api/task"
import { createTaskDisclosure } from "@/shared/lib/task-disclosure-factory"

import { createTaskFactory } from "."
const taskModel = createTaskDisclosure()
const createTaskModel = createTaskFactory({
  taskModel,
  defaultType: "inbox",
  defaultDate: null,
})

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
const resultedTasks = {
  "1": {
    id: "1",
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: "1",
  },
  "2": {
    id: "2",
    title: "second",
    description: "my note",
    type: "inbox",
    status: "FINISHED",
    start_date: null,
    user_id: "1",
  }
}
const returnedTask = {
  id: "2",
  title: "second",
  description: "my note",
  type: "inbox",
  status: "FINISHED",
  start_date: null,
  user_id: "1",
}

describe('create task', () => {
  test("Create task on the server if user is authenticated", async () => {
    const mock = vi.fn(() => returnedTask)
    const { $title, $description, $status, $startDate, $isAllowToSubmit, $type } = createTaskModel
    const { createTaskClosed } = taskModel
    const scope = fork({
      values: [
        [$title, "sixth"],
        [$description, "my note"],
        [$status, "FINISHED"],
        [$startDate, null],
        [$type, "inbox"],
        [$isAuthenticated, true],
        [$isAllowToSubmit, true],
        [$taskKv, tasks],
      ],
      handlers: [[createTaskQuery.__.executeFx, mock]],
    })
    await allSettled(createTaskClosed, { scope })
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
    expect(mock).toReturnWith(returnedTask)
    expect(scope.getState($taskKv)).toStrictEqual(resultedTasks)
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe("")
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
  test("Create task in localStorage if user is not authenticated", async () => {
    const mock = vi.fn(() => returnedTask)
    const { $title, $description, $status, $startDate, $isAllowToSubmit, $type, _ } = createTaskModel
    const { createTaskClosed } = taskModel
    const scope = fork({
      values: [
        [$title, "sixth"],
        [$description, "my note"],
        [$status, "FINISHED"],
        [$startDate, null],
        [$type, "inbox"],
        [$isAuthenticated, false],
        [$isAllowToSubmit, true],
        [$taskKv, tasks],
      ],
      handlers: [[_.setTaskToLocalStorageFx, mock]],
    })
    await allSettled(createTaskClosed, { scope })
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
    expect(mock).toReturnWith(returnedTask)
    expect(scope.getState($taskKv)).toStrictEqual(resultedTasks)
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe("")
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
})
