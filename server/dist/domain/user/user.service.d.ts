import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class UserService {
    private prismaService;
    constructor(prismaService: PrismaService);
    findOne(where: Prisma.userWhereUniqueInput): Promise<{}>;
}
