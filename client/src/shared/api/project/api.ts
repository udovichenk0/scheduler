import { handleResponse } from "../lib"
import { getProject, postProject } from "../scheduler"
import { getProjectResponse, postProjectResponse } from "../zod"
import { CreateProjectDto } from "./dto"

const getProjects = async () => {
  const data = await getProject({ credentials: "include" })
  return handleResponse(data, getProjectResponse)
}

const createProject = async (params: CreateProjectDto) => {
  const data = await postProject(params, { credentials: "include" })
  return handleResponse(data, postProjectResponse)
}

export const projectApi = {
  getProjects,
  createProject
}