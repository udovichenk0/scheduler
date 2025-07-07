import { createEffect, createEvent, createStore, sample } from "effector";
import { Project } from "./type";
import { authApi } from "@/shared/api/auth/auth.api";
import { projectApi } from "@/shared/api/project/api";

export const $projects = createStore<Project[]>([]);
export const addProject = createEvent<Project>()

const getProjectsFx = createEffect(projectApi.getProjects)

sample({
  clock: addProject,
  source: $projects,
  fn: (projects, project) => {
    return [...projects, project]
  },
  target: $projects
})

sample({
  clock: [authApi.checkSession.finished.success, authApi.signIn.finished.success],
  target: getProjectsFx,
})

sample({
  clock: getProjectsFx.doneData,
  fn: (projects) => {
    console.log(projects)
    return projects
  },
  target: $projects,
})
