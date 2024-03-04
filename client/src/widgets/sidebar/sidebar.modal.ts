import dayjs from "dayjs"

import { $$task } from "@/entities/task/task-item"

import { createModal } from "@/shared/lib/modal"

export const $$modal = createModal({ closeOnClickOutside: true })

export const $inboxTasksCount = $$task.$tasks.map((tasks) => {
  if (!tasks) return 0
  return tasks.filter(
    ({ type, is_deleted }) => type == "inbox" && !is_deleted,
  ).length
})

export const $todayTasksCount = $$task.$tasks.map((tasks) => {
  if (!tasks) return 0
  return tasks.filter(
    ({ start_date, is_deleted }) =>
      dayjs(start_date).isSame(dayjs(), "date") && !is_deleted,
  ).length
})
