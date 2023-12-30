import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { UserDto } from 'src/domain/user/dto/user.dto';
import {
  refreshExpiredMessage,
  refreshInvalidMessage,
} from './constant/refreshErrorMessages';
import {
  refreshExpiredError,
  refreshInvalidError,
} from './constant/refreshErrors';
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
      if (err.message == refreshExpiredError) {
        throw new UnauthorizedException(refreshExpiredMessage);
      }
      if (err.message == refreshInvalidError) {
        throw new UnauthorizedException(refreshInvalidMessage);
      }
    }
  }
}
