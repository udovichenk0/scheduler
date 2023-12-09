import { RouteInstance, RouteParams } from "atomic-router"
import dayjs from "dayjs"
import { createEffect, createEvent, sample } from "effector"

import { $$task } from "@/entities/task/task-item"

import { createModal } from "@/shared/lib/modal"

export const $$modal = createModal({ closeOnClickOutside: true })

export const $inboxTasksCount = $$task.$taskKv.map((kv) => {
  if(!kv) return 0
  return Object.values(kv).filter(({type, is_deleted}) => type == "inbox" && !is_deleted).length
})

export const $todayTasksCount = $$task.$taskKv.map((kv) => {
  if(!kv) return 0
  return Object.values(kv).filter(({ start_date, is_deleted }) =>
    dayjs(start_date).isSame(dayjs(), "date") && !is_deleted,
  ).length
})

export const navigate = createEvent<RouteInstance<RouteParams>>()

sample({
  clock: navigate,
  target: createEffect((route: RouteInstance<RouteParams>) => {
    route.navigate({ params: {}, query: {} })
  }),
})
