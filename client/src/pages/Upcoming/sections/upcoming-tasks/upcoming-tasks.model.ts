import { combine, sample } from "effector"
import dayjs, { Dayjs } from "dayjs"

import { $$task, Task } from "@/entities/task/task-item"

import { takeNextTaskId } from "@/shared/lib/effector/task-selection"

import {
  MIN_DATES_LENGTH,
  MIN_MONTHS_LENGTH,
  generateRemainingDaysOfMonth,
  generateRemainingMonthsOfYear,
} from "../../config"
import {
  $$deleteTask,
  $selectedUpcomingTaskId,
  upcomingTaskIdSelected,
} from "../../upcoming.model"

export const $groupedTasksByYear = $$task.$taskKv.map((kv) => {
  const upcomingTasks = Object.values(kv).filter(
    ({ start_date }) =>
      start_date && dayjs(start_date).isSameOrAfter(dayjs(), "date"),
  )
  return groupTasksByYear(upcomingTasks)
})
export const $upcomingYears = $groupedTasksByYear.map((tasks) => {
  // for example if today is a day before a new year we don't want to show upcoming year as a year section
  const futureYear = dayjs()
    .add(MIN_DATES_LENGTH, "day")
    .add(MIN_MONTHS_LENGTH, "month")
    .format("YYYY")
  const currentYear = dayjs().format("YYYY")
  return Object.fromEntries(
    Object.entries(tasks).filter(
      ([year]) => currentYear != year && futureYear != year,
    ),
  )
})

export const $remainingDays = $groupedTasksByYear.map((groupedTasksByYear) => {
  const currentYear = dayjs().format("YYYY")
  const firstDayOfRemainingDays = dayjs()
    .add(MIN_DATES_LENGTH, "day")
    .startOf("date")
  const lastDayOfRemainingDays = dayjs(firstDayOfRemainingDays).endOf("month")

  const tasks = groupedTasksByYear[currentYear]?.filter(({ start_date }) => {
    return (
      start_date &&
      isSameDateOrBetween({
        date: start_date,
        firstDate: firstDayOfRemainingDays,
        lastDate: lastDayOfRemainingDays,
      })
    )
  })
  const isLastDateOfMonth = firstDayOfRemainingDays.isSame(
    lastDayOfRemainingDays,
    "date",
  )
  return {
    tasks,
    isLastDate: isLastDateOfMonth,
    dateRange: {
      start: firstDayOfRemainingDays.date(),
      end: lastDayOfRemainingDays.date(),
    },
    date: dayjs(firstDayOfRemainingDays),
  }
})

export const $remainingMonths = $groupedTasksByYear.map(
  (groupedTasksByYear) => {
    const date = dayjs()
      .add(MIN_DATES_LENGTH, "day")
      .add(MIN_MONTHS_LENGTH + 1, "month")
    const firstDateOfRemainingMonths = date.startOf("month")
    const lastDateOfRemainingMonths = date.endOf("year")
    const year = firstDateOfRemainingMonths.format("YYYY")

    const tasks = groupedTasksByYear[year]?.filter(({ start_date }) => {
      return (
        start_date &&
        isSameDateOrBetween({
          date: start_date,
          firstDate: firstDateOfRemainingMonths,
          lastDate: lastDateOfRemainingMonths,
        })
      )
    })
    const isLastMonthOfYear = firstDateOfRemainingMonths.isSame(
      lastDateOfRemainingMonths,
      "month",
    )
    return {
      tasks,
      startDate: firstDateOfRemainingMonths.month(),
      isLastMonth: isLastMonthOfYear,
      endDate: lastDateOfRemainingMonths.month(),
      date: dayjs()
        .year(firstDateOfRemainingMonths.year())
        .month(firstDateOfRemainingMonths.month())
        .startOf("month"),
    }
  },
)

export const $monthsListKv = $groupedTasksByYear.map((groupedTasksByYear) => {
  return generateRemainingMonthsOfYear().map((date) => {
    const year = dayjs().format("YYYY")
    const tasks = getTasksForMonth(date, groupedTasksByYear[year])
    return {
      tasks,
      date,
    }
  })
})

export const $daysListKv = $groupedTasksByYear.map((groupedTasksByYear) => {
  return generateRemainingDaysOfMonth().map((date) => {
    const year = dayjs().format("YYYY")
    const tasks = getTasksByDate(date, groupedTasksByYear[year])
    return {
      tasks,
      date,
    }
  })
})
export const $selectedNextTaskId = combine(
  $selectedUpcomingTaskId,
  $daysListKv,
  $monthsListKv,
  $remainingMonths,
  $remainingDays,
  (
    selectedTaskId,
    daysListKv,
    monthsListKv,
    remainingMonths,
    remainingDays,
  ) => {
    if (!selectedTaskId) return null
    const daysList = daysListKv?.map(({ tasks }) => tasks)
    const monthsList = monthsListKv?.map(({ tasks }) => tasks)
    const nextIndex = [
      ...daysList,
      ...monthsList,
      remainingMonths.tasks,
      remainingDays.tasks,
    ].find((tasks) => {
      if (!tasks?.length) return
      return tasks.find((task) => task.id == selectedTaskId)
    })
    const nextTaskId = takeNextTaskId(nextIndex!, selectedTaskId)
    return nextTaskId
  },
)

sample({
  clock: $$deleteTask.taskDeletedById,
  source: $selectedNextTaskId,
  filter: (taskId) => !!taskId,
  target: upcomingTaskIdSelected,
})
function getTasksForMonth(date: Dayjs, tasks: Task[]) {
  return tasks?.filter(({ start_date }) => {
    if (!start_date) return
    return (
      dayjs(start_date).isSame(date, "month") &&
      dayjs(start_date).isSame(date, "year")
    )
  })
}

function getTasksByDate(date: Dayjs, tasks: Task[]) {
  return tasks?.filter(({ start_date }) => {
    if (!start_date) return
    return dayjs(start_date).isSame(date, "date")
  })
}

function groupTasksByYear(array: Task[]) {
  return array.reduce(
    (groups, task) => {
      const year = dayjs(task.start_date).format("YYYY")
      if (!groups[year]) {
        groups[year] = []
      }
      groups[year].push(task)
      return groups
    },
    {} as Record<string, Task[]>,
  )
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
