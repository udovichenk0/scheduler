import { PrismaService } from 'src/database/prisma.service';
import { UserDto } from 'src/domain/user/dto/user.dto';
export declare class RefreshService {
    private prismaService;
    constructor(prismaService: PrismaService);
    signRefresh(userData: UserDto): Promise<string>;
    verifyRefresh(token: string): Promise<UserDto | undefined>;
}
