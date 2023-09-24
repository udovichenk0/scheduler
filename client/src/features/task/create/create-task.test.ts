import { allSettled, fork } from "effector"
import { test, expect, vi, describe } from "vitest"

import { $$session } from "@/entities/session"
import { $$task } from "@/entities/task/task-item"

import { taskApi } from "@/shared/api/task"

import { createTaskFactory } from "."
const createTaskModel = createTaskFactory({
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
  },
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

describe("create task", () => {
  test("Create task on the server if user is authenticated", async () => {
    const mock = vi.fn(() => returnedTask)
    const {
      $title,
      $description,
      $status,
      $startDate,
      $isAllowToSubmit,
      $type,
      createTaskTriggered,
    } = createTaskModel
    const scope = fork({
      values: [
        [$title, "sixth"],
        [$description, "my note"],
        [$status, "FINISHED"],
        [$startDate, null],
        [$type, "inbox"],
        [$$session.$isAuthenticated, true],
        [$isAllowToSubmit, true],
        [$$task._.$taskKv, tasks],
      ],
      handlers: [[taskApi.createTaskQuery.__.executeFx, mock]],
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
    expect(mock).toReturnWith(returnedTask)
    expect(scope.getState($$task.$taskKv)).toStrictEqual(resultedTasks)
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe("")
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
      _,
    } = createTaskModel
    const scope = fork({
      values: [
        [$title, "sixth"],
        [$description, "my note"],
        [$status, "FINISHED"],
        [$startDate, null],
        [$type, "inbox"],
        [$$session.$isAuthenticated, false],
        [$isAllowToSubmit, true],
        [$$task._.$taskKv, tasks],
      ],
      handlers: [[_.setTaskToLocalStorageFx, mock]],
    })
    await allSettled(createTaskTriggered, { scope })
    expect(mock).toHaveBeenCalledOnce()
    expect(mock).toBeCalledWith(null, {
      body: {
        title: "sixth",
        description: "my note",
        type: "inbox",
        status: "FINISHED",
        start_date: null,
      },
    })
    expect(mock).toReturnWith({ result: returnedTask })
    expect(scope.getState($$task.$taskKv)).toStrictEqual(resultedTasks)
    expect(scope.getState($title)).toBe("")
    expect(scope.getState($description)).toBe("")
    expect(scope.getState($status)).toBe("INPROGRESS")
    expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  })
})
