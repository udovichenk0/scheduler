import { combine, createEvent, sample, createStore } from "effector"
import { not, spread } from "patronum"
import dayjs, { Dayjs } from "dayjs"
import { createContext } from "react"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { modifyTaskFactory } from "@/entities/task/task-form"
import { taskFactory, Task, createSorting } from "@/entities/task/task-item"
import { isUnplaced } from "@/entities/task/task-item/lib"

import { TaskId, taskApi } from "@/shared/api/task"
import { selectTaskFactory } from "@/shared/lib/effector"
import { routes } from "@/shared/routing"
import { createIdModal, createModal } from "@/shared/lib/modal"
import { getToday } from "@/shared/lib/date"

import {
  getTasksPerDate,
  getTasksForRemainingMonth,
  getTasksPerMonth,
  getTasksForRemainingYear,
  getTasksPerYear,
} from "./lib"

type Variant = "upcoming" | Dayjs

export const upcomingRoute = routes.upcoming

//factories

export const $$dateModal = createModal({})
export const $$sort = createSorting()
export const $$idModal = createIdModal()

export const $upcomingTasks = taskFactory({
  sortModel: $$sort,
  route: upcomingRoute,
  filter: isUnplaced,
  api: {
    taskQuery: taskApi.upcomingTasksQuery,
    taskStorage: taskApi.upcomingTasksLs,
  },
})
export const $$updateTask = updateTaskFactory()
export const $$createTask = createTaskFactory({
  $$modifyTask: modifyTaskFactory({
    defaultType: "unplaced",
    defaultDate: getToday(),
  }),
})
export const $$taskDisclosure = disclosureTask({
  updateTaskModel: $$updateTask,
  createTaskModel: $$createTask,
})

export const $$trashTask = trashTaskFactory()

export const TaskManagerContext = createContext({
  $$updateTask,
  $$createTask,
  $$taskDisclosure,
})

export const $selectedDate = createStore<Date>(new Date())
export const currentDateSelected = createEvent<Date>()

export const variantSelected = createEvent<Variant>()
export const $variant = createStore<Variant>("upcoming").on(
  variantSelected,
  (_, variant) => variant,
)

export const $tasks = combine(
  $upcomingTasks.$tasks,
  $variant,
  (tasks, variant) => {
    if (variant == "upcoming" && tasks) {
      const tasksPerDate = getTasksPerDate(tasks)
      const tasksForRemainingMonth = getTasksForRemainingMonth(tasks)
      const tasksPerMonth = getTasksPerMonth(tasks)
      const tasksForRemainingYear = getTasksForRemainingYear(tasks)
      const tasksPerYear = getTasksPerYear(tasks)
      return tasksPerDate.concat(
        tasksForRemainingMonth,
        tasksPerMonth,
        tasksForRemainingYear,
        tasksPerYear,
      )
    }
    return []
  },
)

export const $tasksByDate = combine(
  $upcomingTasks.$tasks,
  $variant,
  (tasks, variant) => {
    if (variant != "upcoming" && tasks) {
      return tasks.filter(({ start_date }) => {
        return dayjs(start_date).startOf("date").isSame(variant.startOf("date"))
      })
    }
    return []
  },
)

export const selectTaskIdWithSectionTitle = createEvent<{
  taskId: TaskId
  section: string
}>()
const $selectedSection = createStore<Nullable<string>>(null)

const $sectionTasks = combine(
  $tasks,
  $tasksByDate,
  $selectedSection,
  $variant,
  (upcomingTasks, tasksByDate, selectedUpcomingSection, variant) => {
    if (variant == "upcoming") {
      return (
        upcomingTasks.find((task) => task.title == selectedUpcomingSection)
          ?.tasks || []
      )
    } else {
      return tasksByDate
    }
  },
)
export const $$selectTask = selectTaskFactory(
  $sectionTasks,
  $$trashTask.taskTrashedById,
)

sample({
  clock: selectTaskIdWithSectionTitle,
  target: spread({
    taskId: $$selectTask.selectTaskId,
    section: $selectedSection,
  }),
})

export const $tasksByDateKv = combine($upcomingTasks.$tasks, (tasks) => {
  if (!tasks) return null
  return tasks.reduce((acc: Record<string, Task[]>, item) => {
    const date = dayjs(item.start_date).format("YYYY-MM-DD")
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {})
})

sample({
  clock: currentDateSelected,
  filter: not($$createTask.$isAllowToSubmit),
  target: [$$createTask.dateChanged, $selectedDate],
})

sample({
  clock: currentDateSelected,
  filter: $$createTask.$isAllowToSubmit,
})

sample({
  clock: $$createTask.taskSuccessfullyCreated,
  source: $selectedDate,
  target: $$createTask.dateChanged,
})

sample({
  clock: variantSelected,
  fn: (variant) => {
    if (variant == "upcoming") {
      return dayjs(new Date()).startOf("date").toDate()
    }
    return variant.toDate()
  },
  target: $selectedDate,
})
