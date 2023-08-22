import { RouteInstance, RouteParams } from "atomic-router"
import dayjs from "dayjs"
import { createEffect, createEvent, sample } from "effector"

import { $$task } from "@/entities/task/tasks"

import { createModal } from "@/shared/lib/modal"

export const $$modal = createModal({ closeOnClickOutside: true })

export const $inboxTasksCount = $$task.$taskKv.map((kv) => {
  return Object.values(kv).filter((task) => task.type == "inbox").length
})

export const $todayTasksCount = $$task.$taskKv.map((kv) => {
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
