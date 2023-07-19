import dayjs from "dayjs"
import { $taskKv } from "@/entities/task/tasks"
import { TaskDto } from "@/shared/api/task"
import { MIN_DATES_LENGTH, MIN_MONTHS_LENGTH } from "../../config"

export const $upcomingTasks = $taskKv.map(kv => {
  const mappedTasks = Object.values(kv)
  .filter(({start_date}) => start_date && dayjs(start_date).isSameOrAfter(dayjs(), 'date'))
  return groupTasksByYear(mappedTasks)
})
export const $upcomingYears = $upcomingTasks.map(tasks => {
  const currentYear = dayjs().add(MIN_DATES_LENGTH, 'day').add(MIN_MONTHS_LENGTH, 'month').format('YYYY')
  return Object.fromEntries(Object.entries(tasks).filter(([year]) => currentYear != year))
})

export const $restDays = $upcomingTasks.map(tasks => {
  const year = dayjs().format('YYYY')
  const firstDayOfRemainingDays = dayjs().add(MIN_DATES_LENGTH, 'day').startOf('date')
  const lastDayOfRemainingDays = dayjs(firstDayOfRemainingDays).endOf('month')

  const restTasks = tasks[year]?.filter(({start_date}) => {
    const isSameOrBetween = start_date 
    && dayjs(start_date).isSameOrAfter(firstDayOfRemainingDays, 'date') 
    && dayjs(start_date).isSameOrBefore(lastDayOfRemainingDays, 'date')
    return start_date && isSameOrBetween
  })

  const rest = firstDayOfRemainingDays.date() == lastDayOfRemainingDays.date() ? [] : restTasks

  return {
    restTasks: rest,
    firstDay: firstDayOfRemainingDays.date(),
    lastDay: lastDayOfRemainingDays.date(),
    date: dayjs(firstDayOfRemainingDays)
  } 
})

export const $restMonths = $upcomingTasks.map(tasks => {
  const year = dayjs().format('YYYY')
  const firstDateOfRemainingMonths = dayjs().add(MIN_DATES_LENGTH, 'day').add(MIN_MONTHS_LENGTH + 1, 'month')
  const lastDateOfRemainingMonths = dayjs().endOf('year')
  const restTasks = tasks[year]?.filter(({start_date}) => {

    const isSameOrBetween = dayjs(start_date).isAfter(firstDateOfRemainingMonths, 'month') 
    && dayjs(start_date).isSameOrBefore(lastDateOfRemainingMonths, 'month')
    
    return start_date && isSameOrBetween
  })
  const rest = firstDateOfRemainingMonths.month() == lastDateOfRemainingMonths.month() ? [] : restTasks
  return {
    restTasks: rest,
    startDate: firstDateOfRemainingMonths.month() ,
    endDate: lastDateOfRemainingMonths.month(),
    date: dayjs().month(firstDateOfRemainingMonths.add(1, 'month').month()).startOf('month')
  }
})

function groupTasksByYear(array: TaskDto[]){
  return array.reduce((groups, task) => {
    const formatedYear = dayjs(task.start_date).format("YYYY")
    if (!groups[formatedYear]) {
      groups[formatedYear] = []
    }
    groups[formatedYear].push(task);
    return groups;
  }, {} as Record<string, TaskDto[]>);
}