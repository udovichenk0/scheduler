import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTService } from 'src/domain/token/jwtToken/jwt.service';
import { getTokenFromHeader } from 'src/lib/getTokenFromHeader/getTokenFromHeader';
import {
  TOKEN_IS_NOT_FOUND,
  USER_IS_NOT_AUTHORIZED,
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
      throw new UnauthorizedException(TOKEN_IS_NOT_FOUND);
    }
    const userDto = await this.jwtService.verifyToken(token);
    if (!userDto) {
      throw new UnauthorizedException(USER_IS_NOT_AUTHORIZED);
    }
    req.session['user'] = UserDto.create(userDto);
    return userDto;
  }
}
