import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { PrismaService } from 'src/database/prisma.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
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
  constructor(private prismaService: PrismaService) {}
  async signRefresh(userData: UserDto): Promise<string> {
    const token = await sign(userData, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
    return token;
  }
  async verifyRefresh(token: string) {
    try {
      return await verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.message == refreshExpiredError) {
        throw new UnauthorizedException(refreshExpiredMessage);
      }
      if (err.message == refreshInvalidError) {
        throw new UnauthorizedException(refreshInvalidMessage);
      }
    }
  }
}
