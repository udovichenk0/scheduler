import { createJsonQuery, declareParams } from "@farfetched/core"

import { UserDto } from "@/shared/api/user"

import { UserSchema } from "./user.dto"
export const getUserQuery = createJsonQuery({
  params: declareParams<{ email: string }>(),
  request: {
    method: "GET",
    url: () => "http://localhost:3000/user",
    query: ({ email }) => ({
      email,
    }),
  },
  response: {
    contract: {
      isData: (prepared: unknown): prepared is UserDto =>
        !!UserSchema.safeParse(prepared),
      getErrorMessages: () => [],
    },
  },
})
