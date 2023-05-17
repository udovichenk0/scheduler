import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RefreshService } from './refreshToken/refresh.service';
import { sign } from 'jsonwebtoken';
import { UserDto } from '../user/dto/user.dto';
@Injectable()
export class TokenService {
  constructor(
    private prismaService: PrismaService,
    private refreshService: RefreshService,
  ) {}

  createTokens(payload: UserDto): Promise<string> {
    const token = sign(payload, process.env.PRIVATE_KEY, { expiresIn: '15d' });
    return token;
  }
}
