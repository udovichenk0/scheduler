import dayjs from "dayjs"
import { combine, createEvent, createStore, sample } from "effector"
import { getTaskQuery, TaskDto } from "@/shared/api/task"


export const $taskKv = createStore<Record<number, TaskDto>>({})

export const getTasksTriggered = createEvent()

sample({
  clock: getTaskQuery.finished.success,
  fn: ({result:{result}}) => result.reduce((kv, task) => ({...kv, [task.id]: task}),{}),
  target: $taskKv
})

export const $inboxTasks = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(task => task.type == 'inbox')
})

export const $todayTasks = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(({start_date}) => {
      const isCurrentYear = dayjs().year() == dayjs(start_date).year()
      const isCurrentMonth = dayjs().month() == dayjs(start_date).month()
      const isCurrentDay = dayjs().date() == dayjs(start_date).date()
      return isCurrentYear && isCurrentMonth && isCurrentDay
    }) 
})

//May be do something like: 
export const $todayTasksLength = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(({start_date}) => {
      const isCurrentYear = dayjs().year() == dayjs(start_date).year()
      const isCurrentMonth = dayjs().month() == dayjs(start_date).month()
      const isCurrentDay = dayjs().date() == dayjs(start_date).date()
      return isCurrentYear && isCurrentMonth && isCurrentDay
    }).length 
})

export const $upcomingTasks = combine($taskKv, (kv) => {
  return Object.values(kv)
  .filter(({start_date}) => {
    return start_date && new Date() < new Date(start_date)
  }) 
})

sample({
  clock: getTasksTriggered,
  target: getTaskQuery.start
})
