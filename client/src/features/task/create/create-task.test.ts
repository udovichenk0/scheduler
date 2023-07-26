import { allSettled, createEvent, createStore, fork } from "effector"
import { test, expect, vi } from "vitest"
import { $taskKv } from "@/entities/task/tasks"
import { createTaskQuery } from "@/shared/api/task"
import { createTaskAccordionFactory } from "@/shared/lib/task-accordion-factory"
import { createTaskFactory } from "."

const taskModel = createTaskAccordionFactory()
const createTaskModel = createTaskFactory({
  taskModel,
  defaultType: "inbox",
  defaultDate: null,
})
vi.mock("@/shared/lib/block-expansion", () => {
  return {
    taskExpansionFactory: vi.fn(() => {
      return {
        updateTaskClosed: createEvent(),
        createTaskClosed: createEvent(),
        $newTask: createStore(false),
        $createdTriggered: createStore(false),
        $isAllowToOpenUpdate: createStore(true),
        createTaskToggled: createEvent(),
      }
    }),
  }
})

const items = {
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
const newItems = {
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
  6: {
    id: 6,
    title: "sixth",
    description: "my note",
    type: "inbox",
    status: "FINISHED",
    start_date: null,
    user_id: 1,
  },
}
const returnedValue = {
  id: 6,
  title: "sixth",
  description: "my note",
  type: "inbox",
  status: "FINISHED",
  start_date: null,
  user_id: 1,
}

test("Make a request after task being closed, set new task to the kv store and reset fields", async () => {
  const mock = vi.fn(() => returnedValue)
  const { $title, $description, $status, $startDate, $isAllowToSubmit, $type } =
    createTaskModel
  const { createTaskClosed } = taskModel
  const scope = fork({
    values: [
      [$title, "sixth"],
      [$description, "my note"],
      [$status, "FINISHED"],
      [$startDate, null],
      [$type, "inbox"],
      [$isAllowToSubmit, true],
      [$taskKv, items],
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
  expect(mock).toReturnWith(returnedValue)
  expect(scope.getState($taskKv)).toStrictEqual(newItems)
  expect(scope.getState($title)).toBe("")
  expect(scope.getState($description)).toBe("")
  expect(scope.getState($status)).toBe("INPROGRESS")
  expect(scope.getState($isAllowToSubmit)).toBeFalsy()
})
