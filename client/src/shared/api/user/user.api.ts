import { createJsonQuery, createQuery, declareParams } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { UserDto } from '@/shared/api/user';
import { userSchema } from "./user.dto";

const userValidator = zodContract(userSchema)
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
        contract: {
            isData: (prepared: unknown): prepared is UserDto => !!userSchema.safeParse(prepared),
            getErrorMessages: () => []
        },
    }
}) 