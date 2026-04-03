import { createEffect, createEvent, EventCallable, sample } from "effector"

import { ProjectModel } from "@/entities/project/model"

import { projectApi } from "@/shared/api/project/api"
import { CreateProjectDto } from "@/shared/api/project/dto"
import { CreateInvitationDto } from "@/shared/api/invitation/dto"
import { Project } from "@/entities/project/type"
import { $$session } from "@/entities/session/session.model"
import { invitationApi } from "@/shared/api/invitation/api"

export const createProjectManager = ({
  projectModel,
  projectCreated,
}: {
  projectModel: ProjectModel
  projectCreated?: EventCallable<Project>
}) => {
  const createProject = createEvent<CreateProjectDto>()
  const inviteToProject = createEvent<CreateInvitationDto>()

  const createProjectFx = createEffect(projectApi.createProject)

  sample({
    clock: createProject,
    target: createProjectFx,
  })

  sample({
    clock: createProjectFx.doneData,
    target: projectModel.addProject,
  })

  if (projectCreated) {
    sample({
      clock: createProjectFx.doneData,
      target: projectCreated,
    })
  }

  sample({
    clock: inviteToProject,
    source: $$session.$user,
    filter: (u) => !!u,
    fn: (_, i) => i,
    target: invitationApi.createInvitation.start,
  })

  return {
    createProject,
    inviteToProject,
  }
}

export type ProjectManager = ReturnType<typeof createProjectManager>
