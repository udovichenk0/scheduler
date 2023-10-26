import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JWTService } from 'src/domain/token/jwtToken/jwt.service';
export declare class TokenGuard implements CanActivate {
    private jwtService;
    constructor(jwtService: JWTService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
