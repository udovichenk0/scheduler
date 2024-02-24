import { UserDto } from 'src/domain/user/dto/user.dto';
import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import {
  Errors,
} from 'src/services/err/errors';
import {
  JWT_EXPIRED_ERROR,
  JWT_INVALID_ERROR,
} from '../constant/errors';
@Injectable()
export class JWTService {
  signToken(userData: UserDto):string {
    const token = sign(userData, process.env.JWT_SECRET as string, {
      expiresIn: '30m',
    });
    return token;
  }
  verifyToken(token: string) {
    try {
      return verify(token, process.env.JWT_SECRET as string) as UserDto;
    } catch (err: any) {
      if (err?.message == JWT_EXPIRED_ERROR || err?.message == JWT_INVALID_ERROR) {
        return Errors.Unauthorized()
      }
      return Errors.InternalServerError()
    }
  }
}
