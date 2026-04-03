import { createMutation, createQuery } from "@farfetched/core"
// import { getListsPrivate } from "../scheduler"
import { handleResponse } from "../lib"
// import { getListsPrivateResponse } from "../zod"

// const privateListQuery = createQuery({
//   handler: async () => {
//     const response = await getListsPrivate({ credentials: "include" })
//     return handleResponse(response, getListsPrivateResponse)
//   },
// })

const listsQuery = createQuery({
  handler: async ({}) => {},
})

const listsByIdsQuery = createQuery({
  handler: async () => {},
})

const createListMutation = createMutation({
  handler: async () => {},
})

export const listApi = {
  // privateListQuery,
  listsQuery,
  createListMutation,
}
