import { createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';
import { createTaskFactory } from "@/features/task/create"
import { updateTaskFactory } from "@/features/task/update"
import { taskExpansionFactory } from "@/shared/lib/block-expansion"

export const taskModel = taskExpansionFactory()
export const updateTaskModel = updateTaskFactory({taskModel, defaultType: 'unplaced', defaultDate: new Date()})
export const createTaskModel = createTaskFactory({taskModel, defaultType: 'unplaced', defaultDate: new Date()})

export const $selectedDate = createStore<Date>(new Date())
export const currentDateSelected = createEvent<Date>()
sample({
  clock: currentDateSelected,
  filter: not(createTaskModel.$isAllowToSubmit),
  target: [createTaskModel.dateChanged, $selectedDate]
})
sample({
  clock: createTaskModel.query.finished.success,
  source: $selectedDate,
  fn: (date) => date,
  target: createTaskModel.dateChanged
})