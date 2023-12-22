import dayjs from "dayjs"
import { createEvent, createStore, sample, combine } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { $$task, createSorting } from "@/entities/task/task-item"

import { cookiePersist } from "@/shared/lib/effector/cookie-persist"
import { getNextTaskId } from "@/shared/lib/effector"
import { TaskId } from "@/shared/api/task"
export const $$trashTask = trashTaskFactory()
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
export const $$sort = createSorting()
const $tasks = combine($$task.$taskKv, $$sort.$sortType, (kv, sortType) => {
  if (!kv) return null
  const tasks = Object.values(kv).filter(
    ({ start_date, is_deleted }) =>
      !is_deleted && 
      dayjs(start_date).isSame(dayjs(), "day") ||
      dayjs(start_date).isBefore(dayjs(), "date"),
  )
  return $$sort.sortBy(sortType, tasks)
})

/**
 * !make "Today" task type
 * !Overdue task only can be if it was created as "Today" previously
 */
export const $overdueTasks = $tasks.map((tasks) => {
  return (
    tasks?.filter(
      ({ start_date }) =>
        start_date && dayjs(start_date).isBefore(dayjs(), "date"),
    ) || []
  )
})
export const $todayTasks = $tasks.map((tasks) => {
  return (
    tasks?.filter(({ start_date }) =>
      dayjs(start_date).isSame(dayjs(), "day"),
    ) || []
  )
})

export const selectTaskId = createEvent<Nullable<TaskId>>()
export const selectNextId = createEvent<TaskId>()
export const $selectedTaskId = createStore<Nullable<TaskId>>(null).on(
  selectTaskId,
  (_, id) => id,
)

sample({
  clock: selectNextId,
  source: { t: $todayTasks, o: $overdueTasks },
  fn: ({ t, o }, id) => {
    const tId = getNextTaskId(t, id)
    if (tId) return tId
    const oId = getNextTaskId(o, id)
    if (oId) return oId
    return null
  },
  target: $selectedTaskId,
})

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
  target: selectNextId,
})
