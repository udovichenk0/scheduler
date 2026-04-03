export type Invitation = {
  id: string
  projectId: string
  projectName: string
  inviterId: string
  invited_by: string

  inviteeEmail: string
  inviteeId?: string

  //role: ProjectRole;
  //status: InvitationStatus;

  message?: string

  createdAt: string
  expiresAt: string
  acceptedAt?: string
  declinedAt?: string
  revokedAt?: string

  lastSentAt?: string
  sendCount?: number
}
