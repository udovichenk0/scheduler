import { $$taskModel } from "@/entities/task/model/task.model.ts"

export const $inboxCounter = $$taskModel.$tasks.map((tasks) => {
  return (
    tasks?.reduce((counter, task) => {
      if (task.type == "inbox" && !task.is_trashed) {
        return counter + 1
      }
      return counter
    }, 0) || 0
  )
})

export const $todayCounter = $$taskModel.$tasks.map((tasks) => {
  return (
    tasks?.reduce((counter, task) => {
      if (
        task.type == "unplaced" &&
        !task.is_trashed &&
        task.start_date?.isToday
      ) {
        return counter + 1
      }
      return counter
    }, 0) || 0
  )
})
