import { PrismaService } from 'src/database/prisma.service';
import { AuthCredentialsDto } from './dto/auth.dto';
import { TokenService } from '../token/token.service';
export declare class AuthService {
    private prismaService;
    private tokenService;
    constructor(prismaService: PrismaService, tokenService: TokenService);
    createUser(credentials: AuthCredentialsDto): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        email: string;
        hash: string;
        verified: boolean;
        created_at: Date;
    }, unknown, never> & {}>;
    verifyUser(credentials: AuthCredentialsDto): Promise<{
        user: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            email: string;
            hash: string;
            verified: boolean;
            created_at: Date;
        }, unknown, never> & {};
        access_token: string;
        refresh_token: string;
    }>;
    verifyEmail({ code, email }: {
        code: string;
        email: string;
    }): Promise<{
        user: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            email: string;
            hash: string;
            verified: boolean;
            created_at: Date;
        }, unknown, never> & {};
        access_token: string;
        refresh_token: string;
    }>;
}
