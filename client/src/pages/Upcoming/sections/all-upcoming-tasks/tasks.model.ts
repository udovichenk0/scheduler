import dayjs from "dayjs"
import { $taskKv } from "@/entities/task/tasks"
import { TaskDto } from "@/shared/api/task"
import { MIN_DATES_LENGTH, MIN_MONTHS_LENGTH } from "../../config"

export const $upcomingTasks = $taskKv.map(kv => {
  const mappedTasks = Object.values(kv)
  .filter(({start_date}) => start_date && dayjs(start_date).isSameOrAfter(dayjs(), 'date'))
  return groupTasksMapper(mappedTasks)
})

export const $upcomingYears = $upcomingTasks.map(tasks => {
  const curYear = dayjs().format('YYYY')
  return Object.fromEntries(Object.entries(tasks).filter(([year]) => curYear != year))
})


export const $restDates = $upcomingTasks.map(tasks => {
  const year = dayjs().format('YYYY')
  const startDate = dayjs().add(MIN_DATES_LENGTH, 'day')
  const endDate = dayjs(startDate).endOf('month')
  const restTasks = tasks[year]?.filter(({start_date}) => {
    return start_date && dayjs(start_date).isSameOrAfter(startDate, 'date') && dayjs(start_date).isSameOrBefore(endDate, 'date')
  })
  const rest = dayjs().endOf('month').date() - dayjs().date() < MIN_DATES_LENGTH ? [] : restTasks
  return {
    restTasks: rest,
    startDate: startDate.date(),
    endDate: endDate.date(),
    month: endDate.month()
  } 
})

export const $restMonths = $upcomingTasks.map(tasks => {
  const year = dayjs().format('YYYY')
  const startDate = dayjs().add(MIN_MONTHS_LENGTH, 'month')
  const endDate = dayjs().endOf('year')
  const restTasks = tasks[year]?.filter(({start_date}) => {
    return start_date && dayjs(start_date).isAfter(startDate, 'month') 
    && dayjs(start_date).isSameOrBefore(endDate, 'month')
  })
  const rest = dayjs().endOf('year').month() - dayjs().month() < MIN_MONTHS_LENGTH ? [] : restTasks
  return {
    restTasks: rest,
    startDate: startDate.month() + 1,
    endDate: endDate.month(),
    month: endDate.month()
  }
})

function groupTasksMapper(array: TaskDto[]){
  return array.reduce((groups, task) => {
    const formatedYear = dayjs(task.start_date).format("YYYY")
    if (!groups[formatedYear]) {
      groups[formatedYear] = []
    }
    if(groups[formatedYear]){
      groups[formatedYear].push(task);
    }
    return groups;
  }, {} as Record<string, TaskDto[]>);
}