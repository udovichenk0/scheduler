export enum Event {
  InviteToProject = "invite-to-project",
}

type ProjectInvitationEvent = {
  type: Event.InviteToProject
  email: string
  projectId: string
  invitedBy: string
}

type EventType = ProjectInvitationEvent

export const constructEvent = (event: EventType): string => {
  const { type, ...data } = event

  return JSON.stringify({ type, data })
}
