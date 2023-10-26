import { z } from 'zod';
export declare const userDtoSchema: z.ZodObject<{
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
declare const UserCredentials_base: import("nestjs-zod").ZodDto<{
    email: string;
}, z.ZodObjectDef<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny>, {
    email: string;
}>;
export declare class UserCredentials extends UserCredentials_base {
}
declare const UserDto_base: import("nestjs-zod").ZodDto<{
    email: string;
    id: string;
    verified: boolean;
}, z.ZodObjectDef<{
    id: z.ZodString;
    email: z.ZodString;
    verified: z.ZodBoolean;
}, "strip", z.ZodTypeAny>, {
    email: string;
    id: string;
    verified: boolean;
}>;
export declare class UserDto extends UserDto_base {
}
export {};
