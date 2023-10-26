import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.dto';
import { Request } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    Signup(body: AuthCredentialsDto): Promise<{
        email: string;
        id: string;
        verified: boolean;
    }>;
    Signin(body: AuthCredentialsDto, session: Record<string, any>): Promise<{
        user: {
            email: string;
            id: string;
            verified: boolean;
        };
        access_token: string;
    }>;
    logout(req: Request): Promise<{
        message: string;
    }>;
    verifyEmail(creds: {
        code: string;
        email: string;
    }, session: Record<string, any>): Promise<{
        user: {
            email: string;
            id: string;
            verified: boolean;
        };
        access_token: string;
    }>;
}
