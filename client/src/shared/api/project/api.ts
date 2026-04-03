import { createQuery } from "@farfetched/core"
import { handleResponse } from "../lib"
import { getProject, getProjectPrivate, postProject } from "../scheduler"
import {
  getProjectPrivateResponse,
  getProjectResponse,
  postProjectResponse,
} from "../zod"

import { CreateProjectDto } from "./dto"

const publicProjectsQuery = createQuery({
  handler: async () => {
    const data = await getProject({ credentials: "include" })
    return handleResponse(data, getProjectResponse)
  },
})

const createProject = async (params: CreateProjectDto) => {
  const data = await postProject(params, { credentials: "include" })
  return handleResponse(data, postProjectResponse)
}

const privateProjectQuery = createQuery({
  handler: async () => {
    const response = await getProjectPrivate({ credentials: "include" })
    return handleResponse(response, getProjectPrivateResponse)
  },
})

export const projectApi = {
  publicProjectsQuery,
  createProject,
  privateProjectQuery,
}
