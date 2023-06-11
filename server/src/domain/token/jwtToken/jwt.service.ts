import { UserDto } from './../../user/dto/user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { jwtExpiredError, jwtInvalidError } from './constant/jwtError';
import {
  jwtExpiredMessage,
  jwtInvalidMessage,
} from './constant/jwtErrorMessages';
@Injectable()
export class JWTService {
  async signToken(userData: UserDto): Promise<string> {
    const token = await sign(userData, process.env.JWT_SECRET, {
      expiresIn: '30m',
    });
    return token;
  }
  async verifyToken(token: string) {
    try {
      return await verify(token, process.env.JWT_SECRET);
    } catch (err: any) {
      if (err?.message == jwtExpiredError) {
        throw new UnauthorizedException(jwtExpiredMessage);
      }
      if (err.message == jwtInvalidError) {
        throw new UnauthorizedException(jwtInvalidMessage);
      }
    }
  }
}
