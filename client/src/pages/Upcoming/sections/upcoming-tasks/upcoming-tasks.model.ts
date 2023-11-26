import dayjs, { Dayjs } from "dayjs"

import { $$task, Task } from "@/entities/task/task-item"

import { i18n } from "@/shared/i18n"
import { lowerCase } from "@/shared/lib/typography"
import { LONG_MONTHS_NAMES, LONG_WEEKS_NAMES } from "@/shared/config/constants"

import {
  MIN_DATES_LENGTH,
  MIN_MONTHS_LENGTH,
  generateSequentialDates,
  generateSequentialMonths,
} from "../../config"

//! main store with filter(props(date if i want to choose date)) and pass computed to components

export const $generateTasks = $$task.$taskKv.map((kv) => {
  const tasks = Object.values(kv)
  const first = getTasksPerDate(tasks)
  const second = getTasksForRemainingMonth(tasks)
  const third = getTasksPerMonth(tasks)
  const fourth = getTasksForRemainingYear(tasks)
  const fifth = getTasksPerYear(tasks)
  return first.concat(second, third, fourth, fifth)
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
