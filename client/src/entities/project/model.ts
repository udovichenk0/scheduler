import { createEvent, createStore, sample } from "effector"

import { authApi } from "@/shared/api/auth/auth.api"
import { projectApi } from "@/shared/api/project/api"

import { PrivateProject, Project } from "./type"

const createProjectModel = () => {
  const $projects = createStore<Project[]>([])
  const $privateProject = createStore<Nullable<PrivateProject>>(null)

  // const $$listModel = getListModelInstance()
  const addProject = createEvent<Project>()

  sample({
    clock: addProject,
    source: $projects,
    fn: (projects, project) => {
      return [...projects, project]
    },
    target: $projects,
  })

  sample({
    clock: [
      authApi.checkSession.finished.success,
      authApi.signIn.finished.success,
    ],
    target: projectApi.publicProjectsQuery.start,
  })

  sample({
    clock: projectApi.publicProjectsQuery.finished.success,
    fn: ({ result }) => result,
    target: $projects,
  })

  sample({
    clock: projectApi.privateProjectQuery.finished.success,
    fn: ({ result }) => result,
    target: $privateProject,
  })

  return {
    $projects,
    $privateProject,
    addProject,
  }
}

const $$projectModel = createProjectModel()

export const getProjectModelInstance = () => $$projectModel

export type ProjectModel = ReturnType<typeof createProjectModel>
