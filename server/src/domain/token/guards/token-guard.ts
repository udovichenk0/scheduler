import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from "@nestjs/common";
import { JWTService } from "src/domain/token/jwtToken/jwt.service";
import { getTokenFromHeader } from "src/services/session/get-token-from-header";
import { Request } from "express";
import { UserDto } from "src/domain/user/dto/user.dto";
import { Errors } from "src/services/err/errors";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JWTService) {}
  canActivate(context: ExecutionContext): any {
    const req = context.switchToHttp().getRequest() as Request;
    const token = getTokenFromHeader(req);
    if (!token) {
      return new UnauthorizedException(Errors.Unauthorized());
    }
    const userDto = this.jwtService.verifyToken(token);
    if (!userDto) {
      return new UnauthorizedException(Errors.Unauthorized());
    }
    req.session["user"] = UserDto.create(userDto);
    return userDto;
  }
}
