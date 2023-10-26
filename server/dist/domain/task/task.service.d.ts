import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class TaskService {
    private prismaService;
    constructor(prismaService: PrismaService);
    findMany({ id }: Prisma.taskWhereInput): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {})[]>;
    createOne(data: Prisma.taskCreateInput): Prisma.Prisma__taskClient<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {}, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateOne({ data, where }: Prisma.taskUpdateArgs): Prisma.Prisma__taskClient<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {}, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateStatus({ data, where }: Prisma.taskUpdateArgs): Prisma.Prisma__taskClient<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {}, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteOne({ where }: Prisma.taskDeleteArgs): Prisma.Prisma__taskClient<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        title: string;
        description: string | null;
        type: import(".prisma/client").Type;
        status: import(".prisma/client").Status;
        start_date: Date | null;
        user_id: string;
    }, unknown, never> & {}, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createMany({ user_id, data, }: {
        user_id: string;
        data: Omit<Prisma.taskCreateManyInput, 'user_id' | 'id'>[];
    }): Prisma.PrismaPromise<Prisma.BatchPayload>;
}
