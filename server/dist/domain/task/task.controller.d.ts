import { TaskService } from './task.service';
import { Request } from 'express';
import { CreateManyTasksCredentialDto, CreateTaskCredentialDto, DeleteTaskCredentialsDto, UpdateDateCredentialsDto, UpdateStatusCredentialDto, UpdateTaskCredentialDto } from './dto/task.dto';
export declare class TaskController {
    private taskService;
    constructor(taskService: TaskService);
    getTasks(req: Request): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {})[]>;
    createTask(req: Request, taskCredentials: CreateTaskCredentialDto): Promise<{
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        id: string;
        user_id: string;
        title: string;
        description: string;
        start_date: Date | null;
    }>;
    updateTask(taskCredentials: UpdateTaskCredentialDto): Promise<{
        type: "inbox" | "unplaced";
        status: "FINISHED" | "CANCELED" | "INPROGRESS";
        id: string;
        user_id: string;
        title: string;
        description: string;
        start_date: Date | null;
    }>;
    updateStatus(taskCredentials: UpdateStatusCredentialDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {}>;
    updateDate(taskCredentials: UpdateDateCredentialsDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {}>;
    deleteTask(taskCredentials: DeleteTaskCredentialsDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {}>;
    createMany(data: CreateManyTasksCredentialDto, req: Request): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
