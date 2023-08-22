import { createEvent, createStore, sample } from "effector"
import { not } from "patronum"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createRemoveTaskFactory } from "@/features/task/delete"
import { createTaskFactory } from "@/features/task/create"
import { updateTaskFactory } from "@/features/task/update"

import { $$task } from "@/entities/task/tasks"
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: new Date(),
})
export const $$taskDisclosure = disclosureTask({
  tasks: $$task.$taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
export const $$deleteTask = createRemoveTaskFactory()
export const $nextDate = createStore(new Date())
export const $selectedDate = createStore<Date>(new Date())
export const currentDateSelected = createEvent<Date>()
sample({
  clock: currentDateSelected,
  filter: not($$createTask.$isAllowToSubmit),
  target: [$$createTask.dateChanged, $selectedDate],
})
sample({
  clock: $$createTask.taskSuccessfullyCreated,
  source: $nextDate,
  target: $selectedDate,
})
sample({
  clock: currentDateSelected,
  filter: $$createTask.$isAllowToSubmit,
})
sample({
  clock: currentDateSelected,
  target: $nextDate,
})
sample({
  clock: $$createTask.taskSuccessfullyCreated,
  source: $selectedDate,
  target: $$createTask.dateChanged,
})
