import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RefreshService } from './refreshToken/refresh.service';

@Injectable()
export class TokenService {
  constructor(
    private prismaService: PrismaService,
    private refreshService: RefreshService,
  ) {}

  async createTokens() {}
}
