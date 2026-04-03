import { createQuery } from "@farfetched/core"

import { handleResponse, throwIfError } from "../lib"
import { getInvitation, postInvitation } from "../scheduler"
import { getInvitationResponse } from "../zod"

import { CreateInvitationDto } from "./dto"

const getInvitations = async () => {
  const data = await getInvitation({ credentials: "include" })
  return handleResponse(data, getInvitationResponse)
}

const createInvitation = createQuery({
  handler: async (params: CreateInvitationDto) => {
    const data = await postInvitation(params, { credentials: "include" })
    return throwIfError(data)
  },
})

export const invitationApi = {
  getInvitations,
  createInvitation,
}
