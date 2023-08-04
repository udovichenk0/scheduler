import { fork, allSettled, createEvent, createStore } from "effector"
import { test, expect, vi } from "vitest"

import { $taskKv } from "@/entities/task/tasks"

import { updateTaskQuery } from "@/shared/api/task"
import { createTaskAccordionFactory } from "@/shared/lib/task-accordion-factory"

import { updateTaskFactory } from "."

const taskModel = createTaskAccordionFactory()
const updateTaskModel = updateTaskFactory({ taskModel })
vi.mock("@/shared/lib/block-expansion", () => {
  return {
    taskExpansionFactory: vi.fn(() => {
      return {
        updateTaskOpened: createEvent(),
        $isAllowToOpenCreate: createStore(true),
        updateTaskClosed: createEvent(),
        $updatedTriggered: createStore(false),
        $taskId: createStore<Nullable<number>>(null),
        $newTask: createStore(false),
        $createdTriggered: createStore(false),
      }
    }),
  }
})

const tasks = {
  1: {
    id: 1,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
  2: {
    id: 2,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
  3: {
    id: 3,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
  4: {
    id: 4,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
  5: {
    id: 5,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
}

const updatedTasks = {
  1: {
    id: 1,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
  2: {
    id: 2,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
  3: {
    id: 3,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
  4: {
    id: 4,
    title: "without date",
    description: "",
    type: "inbox",
    status: "INPROGRESS",
    start_date: null,
    user_id: 1,
  },
  5: {
    id: 5,
    title: "title",
    description: "my description",
    type: "inbox",
    status: "FINISHED",
    start_date: null,
    user_id: 1,
  },
}

const returnedValue = {
  id: 5,
  title: "title",
  description: "my description",
  type: "inbox",
  status: "FINISHED",
  start_date: null,
  user_id: 1,
}
test("Make a request after task being closed, update the value in kv store and reset fields", async () => {
  const mock = vi.fn(() => returnedValue)
  const { $status, $description, $isAllowToSubmit, $title, $type, $startDate } =
    updateTaskModel
  const { updateTaskClosed } = taskModel
  const scope = fork({
    values: [
      [$taskKv, tasks],
      [$title, "title"],
      [$description, "my description"],
      [$status, "FINISHED"],
      [$type, "inbox"],
      [$startDate, null],
      [$isAllowToSubmit, true],
    ],
    handlers: [[updateTaskQuery.__.executeFx, mock]],
  })
  await allSettled(updateTaskClosed, { scope, params: 5 })

  expect(mock).toHaveBeenCalledOnce()
  expect(mock).toReturnWith(returnedValue)
  expect(scope.getState($taskKv)).toStrictEqual(updatedTasks)
  expect(scope.getState($isAllowToSubmit)).toBeFalsy()
  expect(scope.getState($title)).toBe("")
  expect(scope.getState($description)).toBe("")
  expect(scope.getState($status)).toBe("INPROGRESS")
  expect(scope.getState($isAllowToSubmit)).toBeFalsy()
})
