import dayjs from "dayjs"
import { createEvent, createStore, sample, combine } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { $$task, createSorting } from "@/entities/task/task-item"

import { cookiePersist } from "@/shared/lib/storage/cookie-persist"
import { selectTaskFactory } from "@/shared/lib/effector"
export const $$trashTask = trashTaskFactory()
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: dayjs(new Date()).startOf('date').toDate(),
})
export const $$taskDisclosure = disclosureTask({
  tasks: $$task.$taskKv,
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
export const $$sort = createSorting()

const $sortedTasks = combine($$task.$taskKv, $$sort.$sortType, (kv, sortType) => {
  if (!kv) return null
  const tasks = Object.values(kv).filter(
    ({ start_date, is_deleted }) =>
      !is_deleted && (
        dayjs(start_date).isSame(dayjs(), "day") 
        || dayjs(start_date).isBefore(dayjs(), "date")
      )
  )
  return $$sort.sortBy(sortType, tasks)
})

/**
 * !make "Today" task type
 * !Overdue task only can be if it was created as "Today" previously
 */
export const $overdueTasks = $sortedTasks.map((tasks) => {
  return (
    tasks?.filter(
      ({ start_date, is_deleted }) =>
        !is_deleted && start_date && dayjs(start_date).isBefore(dayjs(), "date"),
    ) || []
  )
})
export const $todayTasks = $sortedTasks.map((tasks) => {
  return (
    tasks?.filter(({ start_date }) =>
      dayjs(start_date).isSame(dayjs(), "day"),
    ) || []
  )
})

const $tasks = combine($todayTasks, $overdueTasks, (todayTasks, overdueTasks) => {
  return [todayTasks, overdueTasks] 
})
export const $$selectTask = selectTaskFactory($tasks)

export const $isOverdueTasksOpened = createStore(false)
export const toggleOverdueTasksOpened = createEvent()

sample({
  clock: toggleOverdueTasksOpened,
  source: $isOverdueTasksOpened,
  fn: (isOpened) => !isOpened,
  target: $isOverdueTasksOpened,
})
cookiePersist({
  source: $isOverdueTasksOpened,
  name: "overdueTasksOpened",
})

sample({
  clock: $$trashTask.taskTrashedById,
  target: $$selectTask.selectNextId,
})
