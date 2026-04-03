import { createProjectManager } from "@/features/manage-project/model"

import { getProjectModelInstance } from "@/entities/project/model"
import { getTaskModelInstance } from "@/entities/task/model/task.model.ts"
import { createEvent, sample } from "effector"
import { Project } from "@/entities/project/type"
import { routes } from "@/shared/routing/router"

const $$taskModel = getTaskModelInstance()
const projectCreated = createEvent<Project>()
export const $$projectModel = getProjectModelInstance()
export const $$projectManager = createProjectManager({
  projectModel: $$projectModel,
  projectCreated,
})

sample({
  clock: projectCreated,
  fn: (project) => ({ projectId: project.id }),
  target: routes.project.open,
})

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
