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

export const $remainingDays = $upcomingTasks.map(tasks => {
  const currentYear = dayjs().format('YYYY')
  const firstDayOfRemainingDays = dayjs().add(MIN_DATES_LENGTH, 'day').startOf('date')
  const lastDayOfRemainingDays = dayjs(firstDayOfRemainingDays).endOf('month')

  const restTasks = tasks[currentYear]?.filter(({start_date}) => {
    const isSameOrBetween = start_date 
    && dayjs(start_date).isSameOrAfter(firstDayOfRemainingDays, 'date') 
    && dayjs(start_date).isSameOrBefore(lastDayOfRemainingDays, 'date')
    return start_date && isSameOrBetween
  })
  const isLastDateOfMonth = firstDayOfRemainingDays.isSame(lastDayOfRemainingDays, 'date')
  return {
    restTasks,
    isLastDate: isLastDateOfMonth,
    firstDay: firstDayOfRemainingDays.date(),
    lastDay: lastDayOfRemainingDays.date(),
    date: dayjs(firstDayOfRemainingDays)
  } 
})

export const $remainingMonths = $upcomingTasks.map(tasks => {
  const currentYear = dayjs().format('YYYY')
  const firstDateOfRemainingMonths = dayjs().add(MIN_DATES_LENGTH, 'day').add(MIN_MONTHS_LENGTH + 1, 'month')
  const lastDateOfRemainingMonths = dayjs().endOf('year')
  const restTasks = tasks[currentYear]?.filter(({start_date}) => {
    const isSameOrBetween = dayjs(start_date).isSameOrAfter(firstDateOfRemainingMonths, 'month') 
    && dayjs(start_date).isSameOrBefore(lastDateOfRemainingMonths, 'month')
    
    return start_date && isSameOrBetween
  })
  
  const isLastMonthOfYear  = firstDateOfRemainingMonths.isSame(lastDateOfRemainingMonths, 'month')

  return {
    restTasks,
    startDate: firstDateOfRemainingMonths.month(),
    isLastMonth: isLastMonthOfYear,
    endDate: lastDateOfRemainingMonths.month(),
    date: dayjs().month(firstDateOfRemainingMonths.month()).startOf('month')
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