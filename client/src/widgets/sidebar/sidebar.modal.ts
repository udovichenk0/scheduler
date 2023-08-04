import { RouteInstance, RouteParams } from "atomic-router"
import dayjs from "dayjs"
import { combine, createEffect, createEvent, sample } from "effector"
import { $taskKv } from "@/entities/task/tasks"
import { createModal } from "@/shared/lib/modal"

export const modal = createModal({ closeOnClickOutside: true })

export const $inboxTasksCount = combine($taskKv, (kv) => {
  return Object.values(kv).filter((task) => task.type == "inbox").length
})

export const $todayTasksCount = combine($taskKv, (kv) => {
  return Object.values(kv).filter(({ start_date }) =>
    dayjs(start_date).isSame(dayjs(), "date"),
  ).length
})

export const navigate = createEvent<RouteInstance<RouteParams>>()

sample({
  clock: navigate,
  target: createEffect((route: RouteInstance<RouteParams>) => {
    route.navigate({ params: {}, query: {} })
  }),
})
