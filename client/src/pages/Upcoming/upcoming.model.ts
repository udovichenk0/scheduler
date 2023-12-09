import { Store, combine, createEvent, sample, createStore } from "effector"
import { and, not } from "patronum"
import dayjs, { Dayjs } from "dayjs"
import { createContext } from "react"

import { disclosureTask } from "@/widgets/expanded-task/model"

import { createTaskFactory } from "@/features/manage-task/model/create"
import { updateTaskFactory } from "@/features/manage-task/model/update"
import { trashTaskFactory } from "@/features/manage-task/model/trash"

import { $$task, Task, createSorting } from "@/entities/task/task-item"

import { TaskId } from "@/shared/api/task"
import { selectTaskFactory, getNextTaskId } from "@/shared/lib/effector"
import { LONG_MONTHS_NAMES, LONG_WEEKS_NAMES } from "@/shared/config/constants"
import { i18n } from "@/shared/i18n"
import { lowerCase } from "@/shared/lib/typography"

import {
  generateSequentialDates,
  MIN_DATES_LENGTH,
  generateSequentialMonths,
  MIN_MONTHS_LENGTH,
} from "./config"

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

export const $$trashTask = trashTaskFactory()
export const TaskManagerContext = createContext({
  $$updateTask,
  $$createTask,
  $$taskDisclosure,
})

export const $selectedDate = createStore<Date>(new Date())
export const currentDateSelected = createEvent<Date>()

type Variant = "upcoming" | Dayjs
export const variantSelected = createEvent<Variant>()
export const $variant = createStore<Variant>("upcoming").on(
  variantSelected,
  (_, variant) => variant,
)

export const $$sort = createSorting()
const $tasks = combine($$task.$taskKv, $$sort.$sortType, (kv, sortType) => {
  if (!kv) return []
  const tasks = Object.values(kv).filter(({ is_deleted }) => !is_deleted)
  return $$sort.sortBy(sortType, tasks)
})
export const $upcomingTasks = combine($tasks, $variant, (tasks, variant) => {
  if (variant == "upcoming" && tasks) {
    const first = getTasksPerDate(tasks)
    const second = getTasksForRemainingMonth(tasks)
    const third = getTasksPerMonth(tasks)
    const fourth = getTasksForRemainingYear(tasks)
    const fifth = getTasksPerYear(tasks)
    return first.concat(second, third, fourth, fifth)
  }
  return []
})
export const $tasksByDate = combine($tasks, $variant, (tasks, variant) => {
  if (variant != "upcoming" && tasks) {
    return tasks.filter(({ start_date }) => {
      return dayjs(start_date).startOf("date").isSame(variant.startOf("date"))
    })
  }
  return []
})
/////////////////////////////////
export const selectTaskId = createEvent<Nullable<TaskId>>()
export const selectNextId = createEvent<TaskId>()
export const $selectedTaskId = createStore<Nullable<TaskId>>(null).on(
  selectTaskId,
  (_, id) => id,
)

sample({
  clock: selectNextId,
  source: { t: $upcomingTasks, v: $variant },
  filter: ({ v }) => v === "upcoming",
  fn: ({ t }, id) => {
    for (let i = 0; i < t.length; i++) {
      const tasks = t[i].tasks
      const nextTaskId = getNextTaskId(tasks, id)
      if (nextTaskId) return nextTaskId
    }
    return null
  },
  target: $selectedTaskId,
})
sample({
  clock: selectNextId,
  source: { t: $tasksByDate, v: $variant },
  filter: ({ v }) => v != "upcoming",
  fn: ({ t }, id) => getNextTaskId(t, id),
  target: $selectedTaskId,
})

export const $tasksByDateKv = combine($$task.$taskKv, (kv) => {
  if (!kv) return null
  return Object.values(kv).reduce(
    (acc, item) => {
      const date = dayjs(item.start_date).format("YYYY-MM-DD")
      if (!item.start_date) return acc
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(item)
      return acc
    },
    {} as unknown as Record<string, Task[]>,
  )
})

export const $selectedUpcomingTaskId = createStore<Nullable<TaskId>>(null)
export const upcomingTaskIdSelected = createEvent<Nullable<TaskId>>()
export const $$selectTask = selectTaskFactory($tasks as Store<Task[]>)
export const $$selectFilteredTask = selectTaskFactory($tasksByDate)

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
  target: [$selectedUpcomingTaskId.reinit, $$selectTask.reset],
})

sample({
  clock: variantSelected,
  fn: (variant) => {
    if (variant == "upcoming") {
      return new Date()
    }
    return variant.toDate()
  },
  target: $selectedDate,
})
sample({
  clock: $$trashTask.taskTrashedById,
  target: selectNextId,
})
sample({
  clock: $$trashTask.taskTrashedById,
  filter: and($$selectFilteredTask.$selectedTaskId),
  target: $$selectFilteredTask.nextTaskIdSelected,
})

function getTasksPerDate(tasks: Task[]) {
  return generateSequentialDates().map((date) => {
    const t = tasks.filter(({ start_date }) => {
      return dayjs(start_date).isSame(date, "date")
    })
    const isCurrentMonth = dayjs().isSame(date, "month")
    return {
      tasks: t,
      title: `${date.date()} ${
        !isCurrentMonth
          ? lowerCase(i18n.t(LONG_MONTHS_NAMES[dayjs(date).month()]))
          : ""
      } ${getFormattedDateSuffix(date)}`,
      date,
    }
  })
}

function getTasksForRemainingMonth(tasks: Task[]) {
  const firstDay = dayjs().add(MIN_DATES_LENGTH, "day").startOf("date")

  const lastDay = dayjs(firstDay).endOf("month")

  const t = tasks.filter(
    ({ start_date }) =>
      start_date &&
      isSameDateOrBetween({
        date: start_date,
        firstDate: firstDay,
        lastDate: lastDay,
      }),
  )
  return {
    tasks: t,
    title: `${lowerCase(
      i18n.t(LONG_MONTHS_NAMES[firstDay.month()]),
    )} ${firstDay.date()}-${lastDay.date()}`,
    date: firstDay,
  }
}
function getTasksPerMonth(tasks: Task[]) {
  return generateSequentialMonths().map((date) => {
    const row = tasks?.filter(({ start_date }) => {
      if (!start_date) return
      return (
        dayjs(start_date).isSame(date, "month") &&
        dayjs(start_date).isSame(date, "year")
      )
    })

    return {
      tasks: row,
      date,
      title: `${lowerCase(i18n.t(LONG_MONTHS_NAMES[date.month()]))}`,
    }
  })
}
function getTasksForRemainingYear(tasks: Task[]) {
  const date = dayjs()
    .add(MIN_DATES_LENGTH, "day")
    .add(MIN_MONTHS_LENGTH + 1, "month")
  const firstDate = date.startOf("month")
  const lastDate = date.endOf("year")

  const t = tasks?.filter(({ start_date }) => {
    return (
      start_date &&
      isSameDateOrBetween({
        date: start_date,
        firstDate: firstDate,
        lastDate: lastDate,
      })
    )
  })
  const isLastMonthOfYear = firstDate.isSame(lastDate, "month")
  return {
    title: isLastMonthOfYear
      ? lowerCase(i18n.t(LONG_MONTHS_NAMES[firstDate.month()]))
      : `${lowerCase(
          i18n.t(LONG_MONTHS_NAMES[firstDate.month()]),
        )}\u2013${lowerCase(i18n.t(LONG_MONTHS_NAMES[lastDate.month()]))}`,
    tasks: t,
    date: firstDate,
  }
}
function getTasksPerYear(tasks: Task[]) {
  const futureYear = dayjs()
    .add(MIN_DATES_LENGTH, "day")
    .add(MIN_MONTHS_LENGTH, "month")
    .format("YYYY")
  const groupedTasksByYear = tasks.reduce(
    (acc, task) => {
      if (!task.start_date) return acc
      const taskYear = dayjs(task?.start_date).format("YYYY")
      if (taskYear > futureYear) {
        if (acc[taskYear]) {
          acc[taskYear].tasks.push(task)
        } else {
          acc[taskYear] = {
            tasks: [task],
            date: dayjs(task.start_date).startOf("year"),
            title: taskYear,
          }
        }
        return acc
      }
      return acc
    },
    {} as Record<string, { tasks: Task[]; date: Dayjs; title: string }>,
  )
  return Object.values(groupedTasksByYear)
}
function getFormattedDateSuffix(date: Dayjs) {
  if (date.isToday()) {
    return lowerCase(i18n.t("date.today"))
  } else if (date.isTomorrow()) {
    return lowerCase(i18n.t("date.tomorrow"))
  }
  return lowerCase(i18n.t(LONG_WEEKS_NAMES[date.day()]))
}

function isSameDateOrBetween({
  date,
  firstDate,
  lastDate,
}: {
  date: Date
  firstDate: Dayjs
  lastDate: Dayjs
}) {
  const isSameDateOrBetween =
    dayjs(date).isSameOrAfter(firstDate, "date") &&
    dayjs(date).isSameOrBefore(lastDate, "date")
  return isSameDateOrBetween
}
