import dayjs from "dayjs";
import { combine, createEvent, createStore, sample } from "effector";
import { persist } from 'effector-storage/local'
import { createTaskFactory } from "@/features/task/create";
import { updateTaskFactory } from "@/features/task/update";
import { $taskKv } from "@/entities/task/tasks";
import { taskExpansionFactory } from "@/shared/lib/block-expansion";

export const taskModel = taskExpansionFactory()
export const updateTaskModel = updateTaskFactory({taskModel, defaultType: 'unplaced', defaultDate: new Date()})
export const createTaskModel = createTaskFactory({taskModel, defaultType: 'unplaced', defaultDate: new Date()})

export const $overdueTasks = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(task => task.start_date && new Date().getDate() > new Date(task.start_date).getDate())
})

export const $todayTasks = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(({start_date}) => {
      const isCurrentYear = dayjs().year() == dayjs(start_date).year()
      const isCurrentMonth = dayjs().month() == dayjs(start_date).month()
      const isCurrentDay = dayjs().date() == dayjs(start_date).date()
      return isCurrentYear && isCurrentMonth && isCurrentDay
    })
})

export const $isOverdueTasksOpened = createStore(false)
export const toggleOverdueTasksOpened = createEvent()

sample({
  clock: toggleOverdueTasksOpened,
  source: $isOverdueTasksOpened,
  fn: (isOpened) => !isOpened,
  target: $isOverdueTasksOpened
})

persist({
  store: $isOverdueTasksOpened,
  key: 'overdueTasksState',
})
