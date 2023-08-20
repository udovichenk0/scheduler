import { fork, allSettled } from "effector"
import { test, expect, vi, describe } from "vitest"

import { $isAuthenticated } from "@/entities/session"
import { $taskKv } from "@/entities/task/tasks"

import { updateTaskQuery } from "@/shared/api/task"
import { createTaskDisclosure } from "@/shared/lib/task-disclosure-factory"

import { updateTaskFactory } from "."

const taskModel = createTaskDisclosure()
const updateTaskModel = updateTaskFactory({ taskModel })

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

const updatedTasks = {
  "1": {
    id: "1",
    title: "title",
    description: "my description",
    type: "inbox",
    status: "FINISHED",
    start_date: null,
    user_id: "1",
  },
}

const returnedValue = {
  id: "1",
  title: "title",
  description: "my description",
  type: "inbox",
  status: "FINISHED",
  start_date: null,
  user_id: "1",
}
describe("update task", () => {
  test("Update task from the server if user is authenticated, update the value in store and reset fields", async () => {
    const mock = vi.fn(() => returnedValue)
    const {
      $status,
      $description,
      $isAllowToSubmit,
      $title,
      $type,
      $startDate,
    } = updateTaskModel
    const { updateTaskClosed } = taskModel
    const scope = fork({
      values: [
        [$taskKv, tasks],
        [$title, "title"],
        [$description, "my description"],
        [$status, "FINISHED"],
        [$type, "inbox"],
        [$startDate, null],
        [$isAuthenticated, true],
        [$isAllowToSubmit, true],
      ],
      handlers: [[updateTaskQuery.__.executeFx, mock]],
    })
    await allSettled(updateTaskClosed, { scope, params: "5" })

    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toReturnWith(returnedValue)
    expect(scope.getState($taskKv)).toStrictEqual(updatedTasks)
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe("")
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
  test("Update task from localstorage if user is not authenticated, update the value in kv and reset fields", async () => {
    const mock = vi.fn(() => ({result: returnedValue}))
    const {
      $status,
      $description,
      $isAllowToSubmit,
      $title,
      $type,
      $startDate,
      _,
    } = updateTaskModel
    const { updateTaskClosed } = taskModel
    const scope = fork({
      values: [
        [$taskKv, tasks],
        [$title, "title"],
        [$description, "my description"],
        [$status, "FINISHED"],
        [$type, "inbox"],
        [$startDate, null],
        [$isAuthenticated, false],
        [$isAllowToSubmit, true],
      ],
      handlers: [[_.updateTaskFromLocalStorageFx, mock]],
    })
    await allSettled(updateTaskClosed, { scope, params: "1" })

    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toReturnWith({result: returnedValue})
    expect(scope.getState($taskKv)).toStrictEqual(updatedTasks)
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe("")
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
})