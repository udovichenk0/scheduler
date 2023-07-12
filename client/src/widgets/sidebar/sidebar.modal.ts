import dayjs from "dayjs";
import { combine } from "effector";
import { $taskKv } from "@/entities/task/tasks";
import { modalFactory } from "@/shared/lib/modal";

export const modal = modalFactory()


export const $inboxTasksCount = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(task => task.type == 'inbox').length
})

export const $todayTasksCount = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(({start_date}) => {
      const isCurrentYear = dayjs().year() == dayjs(start_date).year()
      const isCurrentMonth = dayjs().month() == dayjs(start_date).month()
      const isCurrentDay = dayjs().date() == dayjs(start_date).date()
      return isCurrentYear && isCurrentMonth && isCurrentDay
    }).length
})
