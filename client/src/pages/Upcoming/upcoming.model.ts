import dayjs, {extend} from "dayjs"
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { combine } from "effector"
import { createTaskFactory } from "@/features/task/create"
import { updateTaskFactory } from "@/features/task/update"
import { $taskKv } from '@/entities/task/tasks';
import { TaskDto } from "@/shared/api/task"
import { taskExpansionFactory } from "@/shared/lib/block-expansion"
extend(isSameOrBefore)
extend(isSameOrAfter)
export const taskModel = taskExpansionFactory()
export const updateTaskModel = updateTaskFactory({taskModel, defaultType: 'unplaced', defaultDate: new Date()})
export const createTaskModel = createTaskFactory({taskModel, defaultType: 'unplaced', defaultDate: new Date()})


export const $upcomingTasks = combine($taskKv, (kv) => {
  const obj =  Object.values(kv)
  .filter(({start_date}) => {
    return start_date && (new Date(start_date) >= new Date() || new Date(start_date).getDate() == new Date().getDate())
  }) 
return groupsOfDates(obj)
})

export const $upcomingYears = combine($upcomingTasks, (tasks) => {
  const curYear = dayjs().format('YYYY')
  return Object.fromEntries(Object.entries(tasks).filter(([year]) => curYear != year))
})

export const $restTasks = combine($upcomingTasks, (tasks) => {
  const startDate = dayjs().add(12, 'day')
  const endDate = dayjs(startDate).endOf('month')
  const restTasks = tasks['2023']?.filter(({start_date}) => {
    return start_date && dayjs(start_date).isSameOrAfter(startDate, 'date') && dayjs(start_date).isSameOrBefore(endDate, 'date')
  })
  const rest = dayjs().endOf('month').date() - dayjs().date() < 12 ? [] : restTasks
  return {
    restTasks: rest,
    startDate: startDate.date(),
    endDate: endDate.date(),
    month: endDate.month()
  }
})

export const $restMonths = combine($upcomingTasks, (tasks) => {
  const year = dayjs().format('YYYY')
  const startDate = dayjs().add(3, 'month')
  const endDate = dayjs().endOf('year')
  const restTasks = tasks[year]?.filter(({start_date}) => {
    return start_date && dayjs(start_date).isAfter(startDate, 'month') && dayjs(start_date).isSameOrBefore(endDate, 'month')
  })
  const rest = dayjs().endOf('year').month() - dayjs().month() < 3 ? [] : restTasks
  return {
    restTasks: rest,
    startDate: startDate.month() + 1,
    endDate: endDate.month(),
    month: endDate.month()
  }
})

function groupsOfDates(array: TaskDto[]){
  return array.reduce((groups, game) => {
    const formatedYear = dayjs(game.start_date).format("YYYY")
    if (!groups[formatedYear]) {
      groups[formatedYear] = []
    }
    if(groups[formatedYear]){
      groups[formatedYear].push(game);
    }
    return groups;
  }, {} as Record<string, TaskDto[]>);
}