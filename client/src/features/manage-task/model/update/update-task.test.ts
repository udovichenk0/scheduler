import { fork, allSettled } from "effector"
import { test, expect, vi, describe } from "vitest"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { taskApi } from "@/shared/api/task"

import { updateTaskFactory } from "./task.model"

const updateTaskModel = updateTaskFactory()

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
    is_deleted: false
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
    date_created: "2023-12-03T11:11:51.227Z",
    is_deleted: false
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
  date_created: "2023-12-03T11:11:51.227Z",
  is_deleted: false
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
      updateTaskTriggeredById,
    } = updateTaskModel
    const scope = fork({
      values: [
        [$$task._.$taskKv, tasks],
        [$title, "title"],
        [$description, "my description"],
        [$status, "FINISHED"],
        [$type, "inbox"],
        [$startDate, null],
        [$$session.$isAuthenticated, true],
        [$isAllowToSubmit, true],
      ],
      handlers: [[taskApi.updateTaskQuery.__.executeFx, mock]],
    })
    await allSettled(updateTaskTriggeredById, { scope, params: "5" })

    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toReturnWith(returnedValue)
    expect(scope.getState($$task.$taskKv)).toStrictEqual(updatedTasks)
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe("")
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
  test("Update task from localstorage if user is not authenticated, update the value in kv and reset fields", async () => {
    const mock = vi.fn(() => ({ result: returnedValue }))
    const {
      $status,
      $description,
      $isAllowToSubmit,
      $title,
      $type,
      $startDate,
      updateTaskTriggeredById,
      _,
    } = updateTaskModel
    const scope = fork({
      values: [
        [$$task._.$taskKv, tasks],
        [$title, "title"],
        [$description, "my description"],
        [$status, "FINISHED"],
        [$type, "inbox"],
        [$startDate, null],
        [$$session.$isAuthenticated, false],
        [$isAllowToSubmit, true],
      ],
      handlers: [[_.updateTaskFromLocalStorageFx, mock]],
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
    expect(mock).toBeCalledWith(null, fields)
    expect(scope.getState($$task.$taskKv)).toStrictEqual(updatedTasks)
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe("")
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
})
