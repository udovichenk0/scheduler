import { UserDto } from 'src/domain/user/dto/user.dto';
import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import {
  expired,
  invalid,
  unauthorizedException,
} from 'src/services/err/errors';
import {
  JWT_EXPIRED,
  JWT_EXPIRED_ERROR,
  JWT_INVALID,
  JWT_INVALID_ERROR,
} from '../constant/errors';
@Injectable()
export class JWTService {
  async signToken(userData: UserDto) {
    const token = await sign(userData, process.env.JWT_SECRET, {
      expiresIn: '30m',
    });
    return token;
  }
  async verifyToken(token: string) {
    try {
      return await verify(token, process.env.JWT_SECRET);
    } catch (err: any) {
      if (err?.message == JWT_EXPIRED_ERROR) {
        throw unauthorizedException({
          description: JWT_EXPIRED,
          error: expired,
        });
      }
      if (err.message == JWT_INVALID_ERROR) {
        throw unauthorizedException({
          description: JWT_INVALID,
          error: invalid,
        });
      }
    }
  }
}
