import dayjs from "dayjs"
import { createEvent, createStore, sample, combine } from "effector"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { taskFactory, createSorting } from "@/entities/task/task-item"
import { isUnplaced } from "@/entities/task/task-item/lib"

import { cookiePersist } from "@/shared/lib/storage/cookie-persist"
import { selectTaskFactory } from "@/shared/lib/effector"
import { taskApi } from "@/shared/api/task"
import { routes } from "@/shared/routing"
import { createIdModal, createModal } from "@/shared/lib/modal"
import { isToday } from "@/shared/lib/date"

export const homeRoute = routes.home
export const $$dateModal = createModal({})
export const $$idModal = createIdModal()

export const $$trashTask = trashTaskFactory()
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  defaultType: "unplaced",
  defaultDate: dayjs(new Date()).startOf("date").toDate(),
})
export const $$taskDisclosure = disclosureTask({
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})
export const $$sort = createSorting()

export const $todayTasks = taskFactory({
  sortModel: $$sort,
  filter: (task) => isUnplaced(task) && isToday(task.start_date),
  route: homeRoute,
  api: {
    taskQuery: taskApi.todayTasksQuery,
    taskStorage: taskApi.todayTasksLs,
  },
})

export const $overdueTasks = taskFactory({
  sortModel: $$sort,
  filter: (task) =>
    isUnplaced(task) &&
    dayjs(new Date(task.start_date!)).isBefore(dayjs().startOf("date")),
  route: homeRoute,
  api: {
    taskQuery: taskApi.overdueTasksQuery,
    taskStorage: taskApi.overdueTasksLs,
  },
})

const $tasks = combine(
  $todayTasks.$tasks,
  $overdueTasks.$tasks,
  (todayTasks, overdueTasks) => {
    return [todayTasks || [], overdueTasks || []]
  },
)
export const $$selectTask = selectTaskFactory(
  $tasks,
  $$trashTask.taskTrashedById,
)

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
