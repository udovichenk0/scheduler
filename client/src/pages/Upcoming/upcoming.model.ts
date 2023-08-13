import { createEvent, createStore, sample } from "effector"
import { not } from "patronum"

import { createTaskFactory } from "@/features/task/create"
import { createRemoveTaskFactory } from "@/features/task/delete"
import { updateTaskFactory } from "@/features/task/update"

import { createTaskDisclosure } from "@/shared/lib/task-disclosure-factory"

export const $$taskDisclosure = createTaskDisclosure()
export const $$updateTask = updateTaskFactory({ taskModel: $$taskDisclosure })
export const $$createTask = createTaskFactory({
  taskModel: $$taskDisclosure,
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$deleteTask = createRemoveTaskFactory()

export const $selectedDate = createStore<Date>(new Date())
export const currentDateSelected = createEvent<Date>()
sample({
  clock: currentDateSelected,
  filter: not($$createTask.$isAllowToSubmit),
  target: [$$createTask.dateChanged, $selectedDate],
})
sample({
  clock: $$createTask.query.finished.success,
  source: $selectedDate,
  fn: (date) => date,
  target: $$createTask.dateChanged,
})
