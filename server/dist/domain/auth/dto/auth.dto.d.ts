import { z } from 'zod';
declare const AuthCredentialsDto_base: import("nestjs-zod").ZodDto<{
    email: string;
    password: string;
}, z.ZodObjectDef<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny>, {
    email: string;
    password: string;
}>;
export declare class AuthCredentialsDto extends AuthCredentialsDto_base {
}
declare const AuthDto_base: import("nestjs-zod").ZodDto<{
    user: {
        email: string;
        id: string;
        verified: boolean;
    };
    access_token: string;
}, z.ZodObjectDef<{
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        verified: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        email: string;
        id: string;
        verified: boolean;
    }, {
        email: string;
        id: string;
        verified: boolean;
    }>;
    access_token: z.ZodString;
}, "strip", z.ZodTypeAny>, {
    user: {
        email: string;
        id: string;
        verified: boolean;
    };
    access_token: string;
}>;
export declare class AuthDto extends AuthDto_base {
}
export {};
