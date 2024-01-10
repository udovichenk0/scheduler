import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { UserDto } from 'src/domain/user/dto/user.dto';
import {
  JWT_EXPIRED,
  JWT_EXPIRED_ERROR,
  JWT_INVALID,
  JWT_INVALID_ERROR,
} from '../constant/errors';
import {
  expired,
  invalid,
  unauthorizedException,
} from 'src/infrastructure/err/errors';
@Injectable()
export class RefreshService {
  async signRefresh(userData: UserDto): Promise<string> {
    const token = await sign(userData, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
    return token;
  }
  async verifyRefresh(token: string) {
    try {
      return (await verify(token, process.env.JWT_SECRET)) as UserDto;
    } catch (err: any) {
      if (err.message == JWT_EXPIRED_ERROR) {
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
