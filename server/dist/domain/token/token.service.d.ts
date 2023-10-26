import { PrismaService } from 'src/database/prisma.service';
import { RefreshService } from './refreshToken/refresh.service';
import { UserDto } from '../user/dto/user.dto';
import { JWTService } from './jwtToken/jwt.service';
import { UserService } from '../user/user.service';
export declare class TokenService {
    private prismaService;
    private refreshService;
    private userService;
    private jwtService;
    constructor(prismaService: PrismaService, refreshService: RefreshService, userService: UserService, jwtService: JWTService);
    issueTokens(userData: UserDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refresh(refreshToken: string, session: Record<string, any>): Promise<{
        access_token: string;
        userData: UserDto;
    } | null>;
}
