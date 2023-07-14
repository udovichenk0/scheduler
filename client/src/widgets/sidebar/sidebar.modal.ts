import dayjs from "dayjs";
import { combine } from "effector";
import { $taskKv } from "@/entities/task/tasks";
import { modalFactory } from "@/shared/lib/modal";

export const modal = modalFactory({closeOnClickOutside: true});

export const $inboxTasksCount = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(task => task.type == 'inbox').length
})

export const $todayTasksCount = combine($taskKv, (kv) => {
  return Object.values(kv)
    .filter(({start_date}) => dayjs(start_date).isSame(dayjs(), 'date')).length
})
