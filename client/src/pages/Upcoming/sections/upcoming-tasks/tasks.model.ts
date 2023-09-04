import dayjs, { Dayjs } from "dayjs"

import { $$task, Task } from "@/entities/task/tasks"

import { MIN_DATES_LENGTH, MIN_MONTHS_LENGTH } from "../../config"

export const $upcomingTasks = $$task.$taskKv.map((kv) => {
  const mappedTasks = Object.values(kv).filter(
    ({ start_date }) =>
      start_date && dayjs(start_date).isSameOrAfter(dayjs(), "date"),
  )
  return groupTasksByYear(mappedTasks)
})

export const $upcomingYears = $upcomingTasks.map((tasks) => {
  const futureYear = dayjs()
    .add(MIN_DATES_LENGTH, "day")
    .add(MIN_MONTHS_LENGTH, "month")
    .format("YYYY")
  return Object.fromEntries(
    Object.entries(tasks).filter(([year]) => futureYear != year),
  )
})

export const $remainingDays = $upcomingTasks.map((tasks) => {
  const currentYear = dayjs().format("YYYY")
  const firstDayOfRemainingDays = dayjs()
    .add(MIN_DATES_LENGTH, "day")
    .startOf("date")
  const lastDayOfRemainingDays = dayjs(firstDayOfRemainingDays).endOf("month")

  const restTasks = tasks[currentYear]?.filter(({ start_date }) => {
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
    restTasks,
    isLastDate: isLastDateOfMonth,
    firstDay: firstDayOfRemainingDays.date(),
    lastDay: lastDayOfRemainingDays.date(),
    date: dayjs(firstDayOfRemainingDays),
  }
})

export const $remainingMonths = $upcomingTasks.map((tasks) => {
  const currentYear = dayjs().format("YYYY")
  const firstDateOfRemainingMonths = dayjs()
    .add(MIN_DATES_LENGTH, "day")
    .add(MIN_MONTHS_LENGTH + 1, "month")
  const lastDateOfRemainingMonths = dayjs().endOf("year")
  const restTasks = tasks[currentYear]?.filter(({ start_date }) => {
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
    restTasks,
    startDate: firstDateOfRemainingMonths.month(),
    isLastMonth: isLastMonthOfYear,
    endDate: lastDateOfRemainingMonths.month(),
    date: dayjs().month(firstDateOfRemainingMonths.month()).startOf("month"),
  }
})

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
