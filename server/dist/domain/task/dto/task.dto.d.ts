import { z } from 'zod';
declare const CreateTaskCredentialDto_base: import("nestjs-zod").ZodDto<{
    type: "inbox" | "unplaced";
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    title: string;
    description: string;
    start_date: Date | null;
}, z.ZodObjectDef<{
    title: z.ZodString;
    description: z.ZodString;
    status: z.ZodEnum<["FINISHED", "CANCELED", "INPROGRESS"]>;
    type: z.ZodEnum<["inbox", "unplaced"]>;
    start_date: z.ZodNullable<z.ZodPipeline<z.ZodString, z.ZodDate>>;
}, "strip", z.ZodTypeAny>, {
    type: "inbox" | "unplaced";
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    title: string;
    description: string;
    start_date: string | null;
}>;
export declare class CreateTaskCredentialDto extends CreateTaskCredentialDto_base {
}
declare const UpdateTaskCredentialDto_base: import("nestjs-zod").ZodDto<{
    task: {
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        title: string;
        description: string;
        start_date: Date | null;
    };
    id: string;
}, z.ZodObjectDef<{
    id: z.ZodString;
    task: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        status: z.ZodEnum<["FINISHED", "CANCELED", "INPROGRESS"]>;
        type: z.ZodEnum<["inbox", "unplaced"]>;
        start_date: z.ZodNullable<z.ZodPipeline<z.ZodString, z.ZodDate>>;
    }, "strip", z.ZodTypeAny, {
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        title: string;
        description: string;
        start_date: Date | null;
    }, {
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        title: string;
        description: string;
        start_date: string | null;
    }>;
}, "strip", z.ZodTypeAny>, {
    task: {
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        title: string;
        description: string;
        start_date: string | null;
    };
    id: string;
}>;
export declare class UpdateTaskCredentialDto extends UpdateTaskCredentialDto_base {
}
declare const UpdateDateCredentialsDto_base: import("nestjs-zod").ZodDto<{
    id: string;
    date: Date | null;
}, z.ZodObjectDef<{
    id: z.ZodString;
    date: z.ZodNullable<z.ZodPipeline<z.ZodString, z.ZodDate>>;
}, "strip", z.ZodTypeAny>, {
    id: string;
    date: string | null;
}>;
export declare class UpdateDateCredentialsDto extends UpdateDateCredentialsDto_base {
}
export declare const updateStatusCredentialsDto: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["FINISHED", "CANCELED", "INPROGRESS"]>;
}, "strip", z.ZodTypeAny, {
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    id: string;
}, {
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    id: string;
}>;
declare const UpdateStatusCredentialDto_base: import("nestjs-zod").ZodDto<{
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    id: string;
}, z.ZodObjectDef<{
    id: z.ZodString;
    status: z.ZodEnum<["FINISHED", "CANCELED", "INPROGRESS"]>;
}, "strip", z.ZodTypeAny>, {
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    id: string;
}>;
export declare class UpdateStatusCredentialDto extends UpdateStatusCredentialDto_base {
}
declare const CreateManyTasksCredentialDto_base: import("nestjs-zod").ZodDto<{
    tasks: {
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        title: string;
        description: string;
        start_date: Date | null;
    }[];
}, z.ZodObjectDef<{
    tasks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        status: z.ZodEnum<["FINISHED", "CANCELED", "INPROGRESS"]>;
        type: z.ZodEnum<["inbox", "unplaced"]>;
        start_date: z.ZodNullable<z.ZodPipeline<z.ZodString, z.ZodDate>>;
    }, "strip", z.ZodTypeAny, {
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        title: string;
        description: string;
        start_date: Date | null;
    }, {
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        title: string;
        description: string;
        start_date: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny>, {
    tasks: {
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        title: string;
        description: string;
        start_date: string | null;
    }[];
}>;
export declare class CreateManyTasksCredentialDto extends CreateManyTasksCredentialDto_base {
}
declare const TaskDto_base: import("nestjs-zod").ZodDto<{
    type: "inbox" | "unplaced";
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    id: string;
    user_id: string;
    title: string;
    description: string;
    start_date: Date | null;
}, z.ZodObjectDef<{
    title: z.ZodString;
    description: z.ZodString;
    status: z.ZodEnum<["FINISHED", "CANCELED", "INPROGRESS"]>;
    type: z.ZodEnum<["inbox", "unplaced"]>;
    start_date: z.ZodNullable<z.ZodDate>;
    id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny>, {
    type: "inbox" | "unplaced";
    status: "FINISHED" | "CANCELED" | "INPROGRESS";
    id: string;
    user_id: string;
    title: string;
    description: string;
    start_date: Date | null;
}>;
export declare class TaskDto extends TaskDto_base {
}
export declare const DeleteTaskCredentialSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
declare const DeleteTaskCredentialsDto_base: import("nestjs-zod").ZodDto<{
    id: string;
}, z.ZodObjectDef<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny>, {
    id: string;
}>;
export declare class DeleteTaskCredentialsDto extends DeleteTaskCredentialsDto_base {
}
export {};
