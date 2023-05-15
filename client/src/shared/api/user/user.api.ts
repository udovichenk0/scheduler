import { createJsonQuery, declareParams } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { UserSchema } from "./user.dto";

const userValidator = zodContract(UserSchema)
export const getUserQuery = createJsonQuery({
    params: declareParams<{email: string}>(),
    request: {
        method: 'GET',
        url: (email) => 'http://localhost:3000/user',
        query: ({email}) => ({
            email
        })
    },
    response: {
        contract: userValidator
    }
})