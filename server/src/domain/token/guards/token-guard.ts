import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTService } from 'src/domain/token/jwtToken/jwt.service';
import { getTokenFromHeader } from 'src/lib/getTokenFromHeader/getTokenFromHeader';
import {
  tokenNotFound,
  userNotAuthorized,
} from '../constant/tokenErrorMessages';
import { Request } from 'express';
import { UserDto } from 'src/domain/user/dto/user.dto';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JWTService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const token = getTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException(tokenNotFound);
    }
    const userDto = await this.jwtService.verifyToken(token);
    if (!userDto) {
      throw new UnauthorizedException(userNotAuthorized);
    }
    req.session['user'] = UserDto.create(userDto);
    return userDto;
  }
}
