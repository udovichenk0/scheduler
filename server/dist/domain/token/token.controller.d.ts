import { TokenService } from './token.service';
import { Request } from 'express';
export declare class TokenController {
    private tokenService;
    constructor(tokenService: TokenService);
    refresh(req: Request, session: Record<string, any>): Promise<{
        access_token: string;
        userData: import("../user/dto/user.dto").UserDto;
    } | null>;
    test(): Promise<string>;
}
