import { createWsConnection } from "./"

export const invitationWs = createWsConnection("invitation")

export enum InvitationEvent {
  InvitedToProject = "invited-to-project",
}

type ProjectInvitationEvent = {
  type: InvitationEvent.InvitedToProject
  email: string
  projectId: string
  invitedBy: string
}

export type GroupedInvitationEvents = ProjectInvitationEvent
