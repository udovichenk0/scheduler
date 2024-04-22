import { createGate } from "effector-react"
import { sample } from "effector"

import { createTaskCounter } from "@/entities/task/task-item/model/counter.model"

import { isToday } from "@/shared/lib/date"
import { taskApi } from "@/shared/api/task"
import { createModal } from "@/shared/lib/modal"

export const $$modal = createModal({ closeOnClickOutside: true })
export const gate = createGate()

export const $inboxCounter = createTaskCounter({
  filter: (task) => task.type == "inbox",
  api: {
    taskQuery: taskApi.inboxTasksCountQuery,
    taskLs: taskApi.inboxTasksCountLs,
  },
})
export const $todayCounter = createTaskCounter({
  filter: ({ start_date }) => !!start_date && isToday(start_date),
  api: {
    taskQuery: taskApi.todayTasksCountQuery,
    taskLs: taskApi.todayTasksCountLs,
  },
})

sample({
  clock: gate.open,
  target: [$inboxCounter.getCount, $todayCounter.getCount],
})
