import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JWTService } from 'src/domain/token/jwtToken/jwt.service';
import { getTokenFromHeader } from 'src/services/session/get-token-from-header';
import { TOKEN_IS_NOT_FOUND, USER_IS_NOT_AUTHORIZED } from '../constant/errors';
import { Request } from 'express';
import { UserDto } from 'src/domain/user/dto/user.dto';
import {
  not_found,
  unauthorized,
  unauthorizedException,
} from 'src/services/err/errors';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JWTService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const token = getTokenFromHeader(req);
    if (!token) {
      throw unauthorizedException({
        description: TOKEN_IS_NOT_FOUND,
        error: not_found,
      });
    }
    const userDto = await this.jwtService.verifyToken(token);
    if (!userDto) {
      throw unauthorizedException({
        description: USER_IS_NOT_AUTHORIZED,
        error: unauthorized,
      });
    }
    req.session['user'] = UserDto.create(userDto);
    return userDto;
  }
}
