import { isToday } from "@/shared/lib/date"
import { $$taskModel } from "@/entities/task"

export const $inboxCounter = $$taskModel.$tasks.map((tasks) => {
  return tasks?.reduce((counter, task) => {
    if(task.type == "inbox" && !task.is_trashed){
      return counter+1
    }
    return counter
  }, 0) || 0
})

export const $todayCounter = $$taskModel.$tasks.map((tasks) => {
  return tasks?.reduce((counter, task) => {
    if(task.type == "unplaced" && !task.is_trashed && isToday(task.start_date)){
      return counter+1
    }
    return counter
  }, 0) || 0
})