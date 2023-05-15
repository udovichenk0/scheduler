import { createJsonQuery, createQuery, declareParams } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { UserDto } from '@/shared/api/user';
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
        contract: {
            isData: (prepared: unknown): prepared is UserDto => !!UserSchema.safeParse(prepared),
            getErrorMessages: () => []
        },
    }
}) 