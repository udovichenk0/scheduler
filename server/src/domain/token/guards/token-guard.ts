import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTService } from 'src/domain/token/jwtToken/jwt.service';
import { isTokenInHeader } from 'src/lib/isTokenInHeader/isTokenInHeader';
import { userNotAuthorized } from '../constant/tokenErrorMessages';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JWTService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = isTokenInHeader(req);
    const verified = await this.jwtService.verifyToken(token);
    if (!verified) {
      throw new UnauthorizedException(userNotAuthorized);
    }
    return verified;
  }
}
