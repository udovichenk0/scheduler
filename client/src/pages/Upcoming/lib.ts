import { Task } from "@/entities/task/type.ts"

import { lowerCase } from "@/shared/lib/typography/lower-case.ts"
import { i18n } from "@/shared/i18n/i18n.ts"
import { LONG_MONTHS_NAMES, LONG_WEEKS_NAMES } from "@/shared/config/constants"
import { SDate, sdate } from "@/shared/lib/date/lib"

import {
  generateSequentialDates,
  MIN_DATES_LENGTH,
  generateSequentialMonths,
  MIN_MONTHS_LENGTH,
} from "./config"

export function getTasksPerDate(tasks: Task[]) {
  return generateSequentialDates().map((date) => {
    const t = tasks.filter(({ start_date }) => {
      return start_date?.isSameDate(date)
    })
    const isCurrentMonth = date.isSameMonth(sdate())
    return {
      tasks: t,
      title: `${date.date} ${
        !isCurrentMonth ? lowerCase(i18n.t(LONG_MONTHS_NAMES[date.month])) : ""
      } ${getFormattedDateSuffix(date)}`,
      date,
    }
  })
}

export function getTasksForRemainingMonth(tasks: Task[]) {
  const firstDay = sdate().addDay(MIN_DATES_LENGTH).startDate()

  const lastDay = firstDay.endMonth()

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
    title: `${lowerCase(i18n.t(LONG_MONTHS_NAMES[firstDay.month]))} ${
      firstDay.date
    }-${lastDay.date}`,
    date: firstDay,
  }
}
export function getTasksPerMonth(tasks: Task[]) {
  return generateSequentialMonths().map((date) => {
    const row = tasks?.filter(({ start_date }) => {
      if (!start_date) return
      return start_date.isSameMonth(date) && start_date.isSameYear(date)
    })

    return {
      tasks: row,
      date,
      title: `${lowerCase(i18n.t(LONG_MONTHS_NAMES[date.month]))}`,
    }
  })
}

export function getTasksForRemainingYear(tasks: Task[]) {
  const date = sdate()
    .addDay(MIN_DATES_LENGTH)
    .addMonth(MIN_MONTHS_LENGTH + 1)
  const firstDate = date.startMonth()
  const lastDate = date.endYear()

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
  const isLastMonthOfYear = firstDate.isSameMonth(lastDate)
  return {
    title: isLastMonthOfYear
      ? lowerCase(i18n.t(LONG_MONTHS_NAMES[firstDate.month]))
      : `${lowerCase(
          i18n.t(LONG_MONTHS_NAMES[firstDate.month]),
        )}\u2013${lowerCase(i18n.t(LONG_MONTHS_NAMES[lastDate.month]))}`,
    tasks: t,
    date: firstDate,
  }
}
export function getTasksPerYear(tasks: Task[]) {
  const futureYear = sdate()
    .addDay(MIN_DATES_LENGTH)
    .addMonth(MIN_MONTHS_LENGTH)
    .format("YYYY")
  const groupedTasksByYear = tasks.reduce(
    (acc, task) => {
      if (!task.start_date) return acc
      const taskYear = task?.start_date.format("YYYY")
      if (taskYear > futureYear) {
        if (acc[taskYear]) {
          acc[taskYear].tasks.push(task)
        } else {
          acc[taskYear] = {
            tasks: [task],
            date: task.start_date.startYear(),
            title: taskYear,
          }
        }
        return acc
      }
      return acc
    },
    {} as Record<string, { tasks: Task[]; date: SDate; title: string }>,
  )
  return Object.values(groupedTasksByYear)
}
function getFormattedDateSuffix(date: SDate) {
  if (date.isToday) {
    return lowerCase(i18n.t("date.today"))
  } else if (date.isTomorrow) {
    return lowerCase(i18n.t("date.tomorrow"))
  }
  return lowerCase(i18n.t(LONG_WEEKS_NAMES[date.day]))
}

function isSameDateOrBetween({
  date,
  firstDate,
  lastDate,
}: {
  date: SDate
  firstDate: SDate
  lastDate: SDate
}) {
  const isSameDateOrBetween =
    date.isSameDateOrAfter(firstDate) && date.isSameDateOrBefore(lastDate)
  return isSameDateOrBetween
}
