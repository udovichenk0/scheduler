import { addProject } from "@/entities/project/model";
import { projectApi } from "@/shared/api/project/api";
import { CreateProjectDto } from "@/shared/api/project/dto";
import { createEffect, createEvent, sample } from "effector";

export const createProject = createEvent<CreateProjectDto>()

const createProjectFx = createEffect(projectApi.createProject)

sample({
  clock: createProject,
  target: createProjectFx
})

sample({
  clock: createProjectFx.doneData,
  fn: (data) => {
    return data
  },
  target: addProject
})
