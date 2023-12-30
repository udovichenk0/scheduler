import { createJsonQuery, declareParams } from "@farfetched/core"
import { zodContract } from "@farfetched/zod"

import { GetUserDto } from "./user.dto"
const UserContract = zodContract(GetUserDto)
export const getUserQuery = createJsonQuery({
  params: declareParams<{ email: string }>(),
  request: {
    method: "GET",
    url: () => import.meta.env.VITE_ORIGIN_URL + "user",
    query: ({ email }) => ({
      email,
    }),
  },
  response: {
    contract: UserContract,
    mapData: ({ result }) => result,
  },
})